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

const updateWorkflowSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(400).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).optional(),
  trigger: z.record(z.unknown()).optional(),
  conditions: z.array(z.record(z.unknown())).optional(),
  actions: z.array(z.record(z.unknown())).optional(),
});

interface RouteParams {
  params: { id: string };
}

// GET /api/automations/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { id } = params;

  try {
    const workflow = await db.workflow.findFirst({
      where: { id, tenantId },
      include: {
        executions: {
          orderBy: { startedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!workflow) {
      return apiNotFound("Automation workflow not found");
    }

    return apiSuccess(workflow);
  } catch (error) {
    logger.error("api.automations.get_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to fetch workflow");
  }
}

// PATCH /api/automations/[id]
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

  const parsed = updateWorkflowSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const existing = await db.workflow.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Automation workflow not found");
    }

    const { status, name, description, trigger, conditions, actions } = parsed.data;

    const updated = await db.workflow.update({
      where: { id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        status: status as never,
        trigger: trigger !== undefined ? (trigger as import("@prisma/client").Prisma.InputJsonValue) : undefined,
        conditions: conditions !== undefined ? (conditions as import("@prisma/client").Prisma.InputJsonValue) : undefined,
        actions: actions !== undefined ? (actions as import("@prisma/client").Prisma.InputJsonValue) : undefined,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "WORKFLOW_UPDATED",
        resourceType: "Workflow",
        resourceId: id,
        oldValue: { status: existing.status, name: existing.name },
        newValue: { status: updated.status, name: updated.name },
      }
    );

    return apiSuccess(updated);
  } catch (error) {
    logger.error("api.automations.patch_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to update workflow");
  }
}

// DELETE /api/automations/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId, email: userEmail } = session.user;
  const { id } = params;

  try {
    const existing = await db.workflow.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Workflow not found");
    }

    await db.workflow.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "WORKFLOW_ARCHIVED",
        resourceType: "Workflow",
        resourceId: id,
        oldValue: { name: existing.name },
      }
    );

    return apiSuccess({ archived: true, id });
  } catch (error) {
    logger.error("api.automations.delete_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to archive workflow");
  }
}
