import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  apiSuccess,
  apiCreated,
  apiUnauthorized,
  apiValidationError,
  apiInternalError,
  parsePaginationParams,
  apiPaginated,
} from "@/lib/api-response";
import { createAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";

const createKnowledgeSchema = z.object({
  title: z.string().min(2).max(200),
  content: z.string().min(5),
  type: z.enum(["SERVICE", "FAQ", "POLICY", "TEAM", "LOCATION", "GENERAL", "TESTIMONIAL"]).default("GENERAL"),
  source: z.enum(["MANUAL", "DOCUMENT", "SERVICE", "BOOKING", "AI_GENERATED"]).default("MANUAL"),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "ARCHIVED"]).default("DRAFT"),
});

// GET /api/knowledge - List knowledge items
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);
  const typeFilter = request.nextUrl.searchParams.get("type");
  const statusFilter = request.nextUrl.searchParams.get("status");
  const searchQuery = request.nextUrl.searchParams.get("q");

  try {
    const where: any = { tenantId };
    if (typeFilter && typeFilter !== "ALL") {
      where.type = typeFilter;
    }
    if (statusFilter && statusFilter !== "ALL") {
      where.status = statusFilter;
    }
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { content: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      db.knowledgeItem.findMany({
        where,
        orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
        skip,
        take: limit,
      }),
      db.knowledgeItem.count({ where }),
    ]);

    return apiPaginated(items, { page, limit, total });
  } catch (error) {
    logger.error("api.knowledge.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch knowledge base items");
  }
}

// POST /api/knowledge - Create new knowledge item
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

  const parsed = createKnowledgeSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const practice = await db.practice.findFirst({
      where: { tenantId },
      select: { id: true },
    });

    if (!practice) {
      return apiValidationError("Practice record not found for tenant");
    }

    const item = await db.knowledgeItem.create({
      data: {
        tenantId,
        practiceId: practice.id,
        title: parsed.data.title,
        content: parsed.data.content,
        type: parsed.data.type as never,
        source: parsed.data.source as never,
        status: parsed.data.status as never,
        ownerId: userId,
        version: 1,
        approvedById: parsed.data.status === "APPROVED" ? userId : undefined,
        approvedAt: parsed.data.status === "APPROVED" ? new Date() : undefined,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "KNOWLEDGE_ITEM_CREATED",
        resourceType: "KnowledgeItem",
        resourceId: item.id,
        newValue: { title: item.title, type: item.type, status: item.status },
      }
    );

    return apiCreated(item);
  } catch (error) {
    logger.error("api.knowledge.create_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to create knowledge item");
  }
}
