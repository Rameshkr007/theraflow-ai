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

const updateTestimonialSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "PUBLISHED"]).optional(),
  consentGiven: z.boolean().optional(),
  authorName: z.string().min(1).max(100).optional(),
  content: z.string().min(5).max(1000).optional(),
});

interface RouteParams {
  params: { id: string };
}

// PATCH /api/testimonials/[id]
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

  const parsed = updateTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const existing = await db.testimonial.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Testimonial not found");
    }

    const { status, consentGiven, authorName, content } = parsed.data;

    // Safety constraint: Never publish without client consent!
    if (status === "PUBLISHED" && !existing.consentGiven && consentGiven !== true) {
      return apiValidationError("Ethical Violation: Testimonials cannot be published without documented client consent.");
    }

    const updated = await db.testimonial.update({
      where: { id },
      data: {
        status: status as never,
        consentGiven: consentGiven ?? undefined,
        consentDate: consentGiven ? new Date() : undefined,
        authorName: authorName ?? undefined,
        content: content ?? undefined,
        publishedAt: status === "PUBLISHED" ? new Date() : undefined,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "TESTIMONIAL_STATUS_UPDATED",
        resourceType: "Testimonial",
        resourceId: id,
        oldValue: { status: existing.status, consentGiven: existing.consentGiven },
        newValue: { status: updated.status, consentGiven: updated.consentGiven },
      }
    );

    return apiSuccess(updated);
  } catch (error) {
    logger.error("api.testimonials.patch_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to update testimonial");
  }
}

// DELETE /api/testimonials/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId, email: userEmail } = session.user;
  const { id } = params;

  try {
    const existing = await db.testimonial.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      return apiNotFound("Testimonial not found");
    }

    await db.testimonial.delete({
      where: { id },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "TESTIMONIAL_DELETED",
        resourceType: "Testimonial",
        resourceId: id,
        oldValue: { authorName: existing.authorName },
      }
    );

    return apiSuccess({ deleted: true, id });
  } catch (error) {
    logger.error("api.testimonials.delete_error", { error: error as Error, id, tenantId });
    return apiInternalError("Failed to delete testimonial");
  }
}
