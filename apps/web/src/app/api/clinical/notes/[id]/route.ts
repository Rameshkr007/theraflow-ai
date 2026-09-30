import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  apiSuccess,
  apiUnauthorized,
  apiNotFound,
  apiValidationError,
  apiInternalError,
} from "@/lib/api-response";
import { createAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";

const updateNoteSchema = z.object({
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  mentalStatusExam: z.record(z.unknown()).optional(),
  diagnosisCodes: z.array(z.string()).optional(),
  procedureCodes: z.array(z.string()).optional(),
  riskLevel: z.enum(["LOW", "MODERATE", "HIGH", "CRISIS"]).optional(),
  homeworkAssigned: z.string().optional(),
  clinicalImpression: z.string().optional(),
  isSigned: z.boolean().optional(),
  signatureText: z.string().optional(),
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
    const note = await db.clinicalNote.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: {
        booking: { select: { id: true, startTime: true, service: { select: { name: true } } } },
        superbills: true,
      },
    });

    if (!note) {
      return apiNotFound("Clinical note not found");
    }

    return apiSuccess(note);
  } catch (error) {
    logger.error("clinical.get_note_error", { error: error as Error });
    return apiInternalError("Failed to fetch note");
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

  const existing = await db.clinicalNote.findFirst({
    where: { id: params.id, tenantId: session.user.tenantId },
  });

  if (!existing) {
    return apiNotFound("Clinical note not found");
  }

  if (existing.isSigned) {
    return apiValidationError("Signed clinical notes are locked and cannot be edited. A clinical addendum must be created.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON");
  }

  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const data = parsed.data;

  try {
    const isNowSigning = data.isSigned && !existing.isSigned;

    const updated = await db.clinicalNote.update({
      where: { id: params.id },
      data: {
        ...(data.clientName ? { clientName: data.clientName } : {}),
        ...(data.clientEmail !== undefined ? { clientEmail: data.clientEmail || null } : {}),
        ...(data.subjective ? { subjective: data.subjective } : {}),
        ...(data.objective ? { objective: data.objective } : {}),
        ...(data.assessment ? { assessment: data.assessment } : {}),
        ...(data.plan ? { plan: data.plan } : {}),
        ...(data.mentalStatusExam ? { mentalStatusExam: data.mentalStatusExam as Prisma.InputJsonValue } : {}),
        ...(data.diagnosisCodes ? { diagnosisCodes: data.diagnosisCodes } : {}),
        ...(data.procedureCodes ? { procedureCodes: data.procedureCodes } : {}),
        ...(data.riskLevel ? { riskLevel: data.riskLevel } : {}),
        ...(data.homeworkAssigned !== undefined ? { homeworkAssigned: data.homeworkAssigned } : {}),
        ...(data.clinicalImpression !== undefined ? { clinicalImpression: data.clinicalImpression } : {}),
        ...(isNowSigning
          ? {
              isSigned: true,
              signedAt: new Date(),
              signedById: session.user.id,
              signatureText: data.signatureText || `Electronically signed by Clinician ID ${session.user.id}`,
            }
          : {}),
      },
    });

    await createAuditLog(
      {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        userEmail: session.user.email ?? undefined,
      },
      {
        action: isNowSigning ? "USER_SIGN_IN" : "CONTENT_UPDATE",
        resourceType: "ClinicalNote",
        resourceId: updated.id,
        metadata: { isSigned: updated.isSigned },
      }
    );

    return apiSuccess(updated);
  } catch (error) {
    logger.error("clinical.update_note_error", { error: error as Error });
    return apiInternalError("Failed to update clinical note");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const existing = await db.clinicalNote.findFirst({
    where: { id: params.id, tenantId: session.user.tenantId },
  });

  if (!existing) {
    return apiNotFound("Clinical note not found");
  }

  if (existing.isSigned) {
    return apiValidationError("Signed legal medical records cannot be deleted");
  }

  try {
    await db.clinicalNote.delete({ where: { id: params.id } });
    return apiSuccess({ deleted: true });
  } catch (error) {
    logger.error("clinical.delete_note_error", { error: error as Error });
    return apiInternalError("Failed to delete note");
  }
}
