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

const updateKnowledgeSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  content: z.string().min(5).optional(),
  type: z.enum(["SERVICE", "FAQ", "POLICY", "TEAM", "LOCATION", "GENERAL", "TESTIMONIAL"]).optional(),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "ARCHIVED"]).optional(),
});

interface RouteParams {
  params: { id: string };
}

// GET /api/knowledge/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { id } = params;

  try {
    const item = await db.knowledgeItem.findFirst({
      where: { id, tenantId },
    });

    if (!item) {
      return apiNotFound("Knowledge item not found");
    }

    return apiSuccess(item);
  } catch (error) {
    logger.error("api.knowledge.get_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to fetch knowledge item");
  }
}

// PATCH /api/knowledge/[id]
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

  const parsed = updateKnowledgeSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const existing = await db.knowledgeItem.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Knowledge item not found");
    }

    const { status, content, title, type } = parsed.data;

    // Track version increments on content changes
    const shouldIncrementVersion = content !== undefined && content !== existing.content;
    const nextVersion = shouldIncrementVersion ? existing.version + 1 : existing.version;

    // Set approval timestamps if approving
    const isApproving = status === "APPROVED" && existing.status !== "APPROVED";
    const approvedAt = isApproving ? new Date() : status ? (status === "APPROVED" ? existing.approvedAt : null) : undefined;
    const approvedById = isApproving ? userId : status ? (status === "APPROVED" ? existing.approvedById : null) : undefined;

    const updated = await db.knowledgeItem.update({
      where: { id },
      data: {
        title: title ?? undefined,
        content: content ?? undefined,
        type: type as never,
        status: status as never,
        version: nextVersion,
        approvedAt,
        approvedById,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: isApproving ? "KNOWLEDGE_ITEM_APPROVED" : "KNOWLEDGE_ITEM_UPDATED",
        resourceType: "KnowledgeItem",
        resourceId: id,
        oldValue: { status: existing.status, title: existing.title },
        newValue: { status: updated.status, title: updated.title, version: updated.version },
      }
    );

    return apiSuccess(updated);
  } catch (error) {
    logger.error("api.knowledge.patch_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to update knowledge item");
  }
}

// DELETE /api/knowledge/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId, email: userEmail } = session.user;
  const { id } = params;

  try {
    const existing = await db.knowledgeItem.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Knowledge item not found");
    }

    await db.knowledgeItem.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "KNOWLEDGE_ITEM_ARCHIVED",
        resourceType: "KnowledgeItem",
        resourceId: id,
        oldValue: { title: existing.title },
      }
    );

    return apiSuccess({ archived: true, id });
  } catch (error) {
    logger.error("api.knowledge.delete_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to archive knowledge item");
  }
}
