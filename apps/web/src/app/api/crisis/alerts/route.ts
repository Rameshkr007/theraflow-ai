import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiSuccess, apiUnauthorized, apiNotFound, apiInternalError, parsePaginationParams, apiPaginated } from "@/lib/api-response";
import { createAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";

const resolveAlertSchema = z.object({
  id: z.string(),
  actionTaken: z.string().min(5),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = parsePaginationParams(searchParams);

  try {
    const where = { tenantId: session.user.tenantId };
    const [alerts, total] = await Promise.all([
      db.crisisAlert.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.crisisAlert.count({ where }),
    ]);

    return apiPaginated(alerts, { page, limit, total });
  } catch (error) {
    logger.error("crisis.get_alerts_error", { error: error as Error });
    return apiInternalError("Failed to fetch crisis alerts");
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiInternalError("Invalid JSON");
  }

  const parsed = resolveAlertSchema.safeParse(body);
  if (!parsed.success) {
    return apiInternalError("Invalid alert resolution payload");
  }

  try {
    const alert = await db.crisisAlert.findFirst({
      where: { id: parsed.data.id, tenantId: session.user.tenantId },
    });

    if (!alert) {
      return apiNotFound("Crisis alert not found");
    }

    const updated = await db.crisisAlert.update({
      where: { id: parsed.data.id },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        resolvedById: session.user.id,
        actionTaken: parsed.data.actionTaken,
      },
    });

    await createAuditLog(
      {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        userEmail: session.user.email ?? undefined,
      },
      {
        action: "CRISIS_ALERT_RESOLVED",
        resourceType: "CrisisAlert",
        resourceId: updated.id,
        metadata: { actionTaken: updated.actionTaken },
      }
    );

    return apiSuccess(updated);
  } catch (error) {
    logger.error("crisis.patch_alert_error", { error: error as Error });
    return apiInternalError("Failed to resolve crisis alert");
  }
}
