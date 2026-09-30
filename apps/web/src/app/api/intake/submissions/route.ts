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

const submitIntakeSchema = z.object({
  formId: z.string().cuid(),
  bookingId: z.string().optional(),
  respondentName: z.string().min(2).max(120),
  respondentEmail: z.string().email(),
  responses: z.record(z.unknown()),
});

// GET /api/intake/submissions - List submissions (auth required)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);
  const formId = request.nextUrl.searchParams.get("formId");

  try {
    const where: any = { tenantId };
    if (formId) where.formId = formId;

    const [submissions, total] = await Promise.all([
      db.intakeSubmission.findMany({
        where,
        include: {
          form: {
            select: { name: true },
          },
        },
        orderBy: { submittedAt: "desc" },
        skip,
        take: limit,
      }),
      db.intakeSubmission.count({ where }),
    ]);

    return apiPaginated(submissions, { page, limit, total });
  } catch (error) {
    logger.error("api.intake.submissions.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch intake submissions");
  }
}

// POST /api/intake/submissions - Client submits intake form
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON body");
  }

  const parsed = submitIntakeSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { formId, bookingId, respondentName, respondentEmail, responses } = parsed.data;

  try {
    const form = await db.intakeForm.findUnique({
      where: { id: formId },
      select: { id: true, tenantId: true, name: true },
    });

    if (!form) {
      return apiValidationError("Specified intake form not found");
    }

    const submission = await db.intakeSubmission.create({
      data: {
        tenantId: form.tenantId,
        formId: form.id,
        bookingId: bookingId || undefined,
        respondentName,
        respondentEmail,
        responses: responses as import("@prisma/client").Prisma.InputJsonValue,
        status: "APPROVED", // Submitted and ready for review
      },
    });

    // Best-effort audit log
    try {
      await createAuditLog(
        { tenantId: form.tenantId, userEmail: respondentEmail },
        {
          action: "INTAKE_SUBMISSION_RECEIVED",
          resourceType: "IntakeSubmission",
          resourceId: submission.id,
          newValue: { formName: form.name, client: respondentName },
        }
      );
    } catch {}

    return apiCreated({
      id: submission.id,
      submittedAt: submission.submittedAt,
      message: "Thank you. Your clinical intake submission has been received securely.",
    });
  } catch (error) {
    logger.error("api.intake.submissions.submit_error", { error: error as Error });
    return apiInternalError("Failed to process intake submission");
  }
}
