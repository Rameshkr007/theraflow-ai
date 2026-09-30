import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  apiSuccess,
  apiUnauthorized,
  apiNotFound,
  apiValidationError,
  apiInternalError,
} from "@/lib/api-response";
import { createAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";

const updatePageSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  slug: z.string().min(1).max(120).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  content: z.record(z.unknown()).optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(300).optional(),
  canonicalUrl: z.string().url().optional().nullable(),
  displayOrder: z.number().int().optional(),
  changeNote: z.string().max(200).optional(),
});

interface RouteParams {
  params: { id: string };
}

// GET /api/pages/[id] - Get page details including version count
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { id } = params;

  try {
    const page = await db.page.findFirst({
      where: { id, tenantId },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 5,
          select: {
            id: true,
            version: true,
            createdAt: true,
            changeNote: true,
            createdById: true,
          },
        },
      },
    });

    if (!page) {
      return apiNotFound("Page not found");
    }

    return apiSuccess(page);
  } catch (error) {
    logger.error("api.pages.get_error", { error: error as Error, pageId: id, tenantId });
    return apiInternalError("Failed to fetch page");
  }
}

// PATCH /api/pages/[id] - Update page content and create version snapshot
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId, email: userEmail } = session.user;
  const { id } = params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON body");
  }

  const parsed = updatePageSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const existing = await db.page.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Page not found");
    }

    const { changeNote, content, ...fields } = parsed.data;

    const updated = await db.$transaction(async (tx) => {
      const nextVersion = existing.version + 1;

      const pageUpdate = await tx.page.update({
        where: { id },
        data: {
          ...fields,
          content: content !== undefined ? (content as import("@prisma/client").Prisma.InputJsonValue) : undefined,
          version: nextVersion,
          publishedVersion: fields.status === "PUBLISHED" ? nextVersion : existing.publishedVersion,
        },
      });

      // Automatically create historical snapshot
      await tx.pageVersion.create({
        data: {
          tenantId,
          pageId: id,
          version: nextVersion,
          content: (pageUpdate.content ?? {}) as import("@prisma/client").Prisma.InputJsonValue,
          changeNote: changeNote ?? (fields.status === "PUBLISHED" ? "Published page update" : "Draft saved"),
          createdById: userId,
        },
      });

      return pageUpdate;
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: fields.status === "PUBLISHED" ? "PAGE_PUBLISHED" : "PAGE_UPDATED",
        resourceType: "Page",
        resourceId: id,
        oldValue: { status: existing.status, title: existing.title },
        newValue: { status: updated.status, title: updated.title, version: updated.version },
      }
    );

    return apiSuccess(updated);
  } catch (error) {
    logger.error("api.pages.update_error", { error: error as Error, pageId: id, tenantId });
    return apiInternalError("Failed to update page");
  }
}

// DELETE /api/pages/[id] - Soft archive or delete page
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId, email: userEmail } = session.user;
  const { id } = params;

  try {
    const existing = await db.page.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Page not found");
    }

    // Do not allow deleting the homepage
    if (existing.type === "HOME") {
      return apiValidationError("The homepage cannot be deleted. You can edit its content instead.");
    }

    await db.page.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "PAGE_ARCHIVED",
        resourceType: "Page",
        resourceId: id,
        oldValue: { title: existing.title },
      }
    );

    return apiSuccess({ archived: true, id });
  } catch (error) {
    logger.error("api.pages.delete_error", { error: error as Error, pageId: id, tenantId });
    return apiInternalError("Failed to archive page");
  }
}
