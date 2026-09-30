import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, apiNotFound, apiInternalError, apiValidationError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const updatePortalSchema = z.object({
  action: z.enum(["TOGGLE_HOMEWORK", "LOG_MOOD"]),
  homeworkId: z.string().optional(),
  moodRating: z.number().min(1).max(10).optional(),
  anxietyLevel: z.number().min(1).max(10).optional(),
  note: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Find Elena Rodriguez portal profile for demo
    const portalUser = await db.clientPortalUser.findFirst({
      where: { email: "elena.r@example.com" },
    });

    if (!portalUser) {
      return apiNotFound("Client portal user not found");
    }

    // Get upcoming booking
    const upcomingBooking = await db.booking.findFirst({
      where: { clientEmail: "elena.r@example.com", status: "CONFIRMED" },
      orderBy: { startTime: "asc" },
      include: { service: { select: { name: true, duration: true } } },
    });

    // Get superbills
    const superbills = await db.superbill.findMany({
      where: { clientEmail: "elena.r@example.com" },
      orderBy: { serviceDate: "desc" },
    });

    return apiSuccess({
      user: {
        name: portalUser.name,
        email: portalUser.email,
        phone: portalUser.phone,
        emergencyContact: portalUser.emergencyContact,
        assignedHomework: portalUser.assignedHomework || [],
        moodCheckIns: portalUser.moodCheckIns || [],
      },
      upcomingBooking: upcomingBooking || {
        id: "demo-booking-elena",
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        service: { name: "Individual CBT Psychotherapy", duration: 50 },
      },
      superbills,
    });
  } catch (error) {
    logger.error("portal.get_error", { error: error as Error });
    return apiInternalError("Failed to fetch client portal");
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON");
  }

  const parsed = updatePortalSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { action, homeworkId, moodRating, anxietyLevel, note } = parsed.data;

  try {
    const portalUser = await db.clientPortalUser.findFirst({
      where: { email: "elena.r@example.com" },
    });

    if (!portalUser) {
      return apiNotFound("Portal user not found");
    }

    if (action === "TOGGLE_HOMEWORK" && homeworkId) {
      const homework = ((portalUser.assignedHomework as any[]) || []).map((hw) => {
        if (hw.id === homeworkId) {
          return { ...hw, completed: !hw.completed };
        }
        return hw;
      });

      const updated = await db.clientPortalUser.update({
        where: { id: portalUser.id },
        data: { assignedHomework: homework },
      });

      return apiSuccess({ assignedHomework: updated.assignedHomework });
    }

    if (action === "LOG_MOOD" && moodRating !== undefined && anxietyLevel !== undefined) {
      const existing = (portalUser.moodCheckIns as any[]) || [];
      const newEntry = {
        date: new Date().toISOString().split("T")[0],
        moodRating,
        anxietyLevel,
        note: note || "",
      };

      const updated = await db.clientPortalUser.update({
        where: { id: portalUser.id },
        data: { moodCheckIns: [...existing, newEntry] },
      });

      return apiSuccess({ moodCheckIns: updated.moodCheckIns });
    }

    return apiSuccess({ updated: true });
  } catch (error) {
    logger.error("portal.post_error", { error: error as Error });
    return apiInternalError("Failed to update portal");
  }
}
