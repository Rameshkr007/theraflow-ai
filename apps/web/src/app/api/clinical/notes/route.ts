import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
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

const createNoteSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  sessionDate: z.string().optional(),
  durationMinutes: z.number().int().default(50),
  noteType: z.enum(["SOAP", "DAP", "PROGRESS", "INTAKE_EVAL"]).default("SOAP"),
  subjective: z.string().min(5),
  objective: z.string().min(5),
  assessment: z.string().min(5),
  plan: z.string().min(5),
  mentalStatusExam: z.record(z.unknown()).optional(),
  diagnosisCodes: z.array(z.string()).default([]),
  procedureCodes: z.array(z.string()).default(["90834"]),
  riskLevel: z.enum(["LOW", "MODERATE", "HIGH", "CRISIS"]).default("LOW"),
  homeworkAssigned: z.string().optional(),
  clinicalImpression: z.string().optional(),
  bookingId: z.string().optional(),
  isSigned: z.boolean().default(false),
  signatureText: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const isSigned = searchParams.get("signed");
  const { page, limit, skip } = parsePaginationParams(searchParams);

  try {
    const where: Prisma.ClinicalNoteWhereInput = {
      tenantId: session.user.tenantId,
      ...(search
        ? {
            OR: [
              { clientName: { contains: search, mode: "insensitive" } },
              { subjective: { contains: search, mode: "insensitive" } },
              { assessment: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(isSigned !== null && isSigned !== undefined && isSigned !== ""
        ? { isSigned: isSigned === "true" }
        : {}),
    };

    const [notes, total] = await Promise.all([
      db.clinicalNote.findMany({
        where,
        orderBy: { sessionDate: "desc" },
        skip,
        take: limit,
      }),
      db.clinicalNote.count({ where }),
    ]);

    return apiPaginated(notes, { page, limit, total });
  } catch (error) {
    logger.error("clinical.notes_get_error", { error: error as Error });
    return apiInternalError("Failed to fetch clinical notes");
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON");
  }

  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const data = parsed.data;

  try {
    const note = await db.clinicalNote.create({
      data: {
        tenantId: session.user.tenantId,
        clientName: data.clientName,
        clientEmail: data.clientEmail || null,
        sessionDate: data.sessionDate ? new Date(data.sessionDate) : new Date(),
        durationMinutes: data.durationMinutes,
        noteType: data.noteType,
        subjective: data.subjective,
        objective: data.objective,
        assessment: data.assessment,
        plan: data.plan,
        mentalStatusExam: data.mentalStatusExam ? (data.mentalStatusExam as Prisma.InputJsonValue) : Prisma.DbNull,
        diagnosisCodes: data.diagnosisCodes,
        procedureCodes: data.procedureCodes,
        riskLevel: data.riskLevel,
        homeworkAssigned: data.homeworkAssigned,
        clinicalImpression: data.clinicalImpression,
        bookingId: data.bookingId || null,
        isSigned: data.isSigned,
        signedAt: data.isSigned ? new Date() : null,
        signedById: data.isSigned ? session.user.id : null,
        signatureText: data.signatureText || null,
        aiGenerated: true,
      },
    });

    await createAuditLog(
      {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        userEmail: session.user.email ?? undefined,
      },
      {
        action: data.isSigned ? "USER_SIGN_IN" : "CONTENT_CREATE",
        resourceType: "ClinicalNote",
        resourceId: note.id,
        metadata: { clientName: note.clientName, isSigned: note.isSigned },
      }
    );

    return apiCreated(note);
  } catch (error) {
    logger.error("clinical.create_note_error", { error: error as Error });
    return apiInternalError("Failed to save clinical note");
  }
}
