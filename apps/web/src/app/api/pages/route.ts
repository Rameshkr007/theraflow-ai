import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  apiSuccess,
  apiCreated,
  apiUnauthorized,
  apiForbidden,
  apiNotFound,
  apiValidationError,
  apiInternalError,
  parsePaginationParams,
  apiPaginated,
} from "@/lib/api-response";
import { createAuditLog } from "@/lib/audit";
import { slugify } from "@/lib/utils";
import { logger } from "@/lib/logger";

const createPageSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).optional(),
  type: z.enum(["HOME", "ABOUT", "SERVICES", "SERVICE_DETAIL", "CONTACT", "FAQ", "BLOG", "CUSTOM"]).default("CUSTOM"),
  content: z.record(z.unknown()).default({}),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(300).optional(),
});

// GET /api/pages - List all pages for tenant's current website
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);

  try {
    const website = await db.website.findFirst({
      where: { tenantId },
      select: { id: true },
    });

    if (!website) {
      return apiSuccess([]);
    }

    const [pages, total] = await Promise.all([
      db.page.findMany({
        where: { tenantId, websiteId: website.id },
        orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
        skip,
        take: limit,
      }),
      db.page.count({
        where: { tenantId, websiteId: website.id },
      }),
    ]);

    return apiPaginated(pages, { page, limit, total });
  } catch (error) {
    logger.error("api.pages.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch pages");
  }
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId, email: userEmail } = session.user;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON body");
  }

  const parsed = createPageSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { title, type, content, seoTitle, seoDescription } = parsed.data;
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(title);

  try {
    const website = await db.website.findFirst({
      where: { tenantId },
    });

    if (!website) {
      return apiNotFound("Website not found for tenant");
    }

    // Check slug uniqueness within website
    const existing = await db.page.findFirst({
      where: { websiteId: website.id, slug },
    });

    const finalSlug = existing ? `${slug}-${Math.random().toString(36).slice(2, 6)}` : slug;

    const pageCount = await db.page.count({ where: { websiteId: website.id } });

    const newPage = await db.$transaction(async (tx) => {
      const created = await tx.page.create({
        data: {
          tenantId,
          websiteId: website.id,
          title,
          slug: finalSlug,
          type: type as never,
          status: "DRAFT",
          content: content as import("@prisma/client").Prisma.InputJsonValue,
          seoTitle: seoTitle ?? `${title} | ${website.subdomain}`,
          seoDescription: seoDescription ?? `Learn more about ${title}`,
          displayOrder: pageCount + 1,
        },
      });

      // Save initial page version snapshot
      await tx.pageVersion.create({
        data: {
          tenantId,
          pageId: created.id,
          version: 1,
          content: (created.content ?? {}) as import("@prisma/client").Prisma.InputJsonValue,
          changeNote: "Initial draft creation",
          createdById: userId,
        },
      });

      return created;
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "PAGE_CREATED",
        resourceType: "Page",
        resourceId: newPage.id,
        newValue: { title: newPage.title, slug: newPage.slug },
      }
    );

    return apiCreated(newPage);
  } catch (error) {
    logger.error("api.pages.create_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to create page");
  }
}
