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

const updateSuperbillSchema = z.object({
  status: z.enum(["DRAFT", "ISSUED", "PAID", "SUBMITTED", "REIMBURSED"]).optional(),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  try {
    const superbill = await db.superbill.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: {
        booking: { select: { id: true, startTime: true } },
        clinicalNote: { select: { id: true, isSigned: true, signedAt: true } },
      },
    });

    if (!superbill) {
      return apiNotFound("Superbill not found");
    }

    return apiSuccess(superbill);
  } catch (error) {
    logger.error("billing.get_superbill_error", { error: error as Error });
    return apiInternalError("Failed to fetch superbill");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const existing = await db.superbill.findFirst({
    where: { id: params.id, tenantId: session.user.tenantId },
  });

  if (!existing) {
    return apiNotFound("Superbill not found");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON");
  }

  const parsed = updateSuperbillSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const updated = await db.superbill.update({
      where: { id: params.id },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes } : {}),
        ...(parsed.data.status === "SUBMITTED" ? { submittedAt: new Date() } : {}),
      },
    });

    await createAuditLog(
      {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        userEmail: session.user.email ?? undefined,
      },
      {
        action: "BILLING_UPDATE",
        resourceType: "Superbill",
        resourceId: updated.id,
        metadata: { newStatus: updated.status },
      }
    );

    return apiSuccess(updated);
  } catch (error) {
    logger.error("billing.patch_superbill_error", { error: error as Error });
    return apiInternalError("Failed to update superbill");
  }
}
