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

const updateIntegrationSchema = z.object({
  status: z.enum(["CONNECTED", "DISCONNECTED", "ERROR", "NEEDS_ATTENTION"]),
  config: z.record(z.unknown()).optional(),
});

interface RouteParams {
  params: { id: string };
}

// PATCH /api/integrations/[id]
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

  const parsed = updateIntegrationSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const existing = await db.integration.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Integration not found");
    }

    const { status, config } = parsed.data;

    const updated = await db.integration.update({
      where: { id },
      data: {
        status: status as never,
        config: config ? (config as import("@prisma/client").Prisma.InputJsonValue) : undefined,
        lastSyncAt: status === "CONNECTED" ? new Date() : existing.lastSyncAt,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: status === "CONNECTED" ? "INTEGRATION_CONNECTED" : "INTEGRATION_DISCONNECTED",
        resourceType: "Integration",
        resourceId: id,
        oldValue: { status: existing.status },
        newValue: { status: updated.status },
      }
    );

    return apiSuccess(updated);
  } catch (error) {
    logger.error("api.integrations.patch_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to update integration");
  }
}

// DELETE /api/integrations/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId, email: userEmail } = session.user;
  const { id } = params;

  try {
    const existing = await db.integration.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Integration not found");
    }

    await db.integration.delete({
      where: { id },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "INTEGRATION_REMOVED",
        resourceType: "Integration",
        resourceId: id,
        oldValue: { provider: existing.provider },
      }
    );

    return apiSuccess({ deleted: true, id });
  } catch (error) {
    logger.error("api.integrations.delete_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to remove integration");
  }
}
