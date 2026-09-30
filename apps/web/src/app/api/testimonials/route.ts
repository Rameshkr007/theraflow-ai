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

const createTestimonialSchema = z.object({
  authorName: z.string().min(1).max(100),
  authorTitle: z.string().max(100).optional(),
  content: z.string().min(5).max(1000),
  rating: z.number().int().min(1).max(5).default(5),
  source: z.enum(["MANUAL", "IMPORT", "GOOGLE", "PSYCHOLOGY_TODAY", "OTHER"]).default("MANUAL"),
  consentGiven: z.boolean().default(false),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "PUBLISHED"]).default("PENDING"),
});

// GET /api/testimonials - List testimonials
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);
  const status = request.nextUrl.searchParams.get("status");

  try {
    const where: any = { tenantId };
    if (status && status !== "ALL") where.status = status;

    const [testimonials, total] = await Promise.all([
      db.testimonial.findMany({
        where,
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      db.testimonial.count({ where }),
    ]);

    return apiPaginated(testimonials, { page, limit, total });
  } catch (error) {
    logger.error("api.testimonials.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch testimonials");
  }
}

// POST /api/testimonials - Create testimonial with ethical consent tracking
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId, email: userEmail } = session.user;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON body");
  }

  const parsed = createTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const practice = await db.practice.findFirst({
      where: { tenantId },
      select: { id: true },
    });

    if (!practice) {
      return apiValidationError("Practice not found");
    }

    const { authorName, authorTitle, content, rating, source, consentGiven, status } = parsed.data;

    const testimonial = await db.testimonial.create({
      data: {
        tenantId,
        practiceId: practice.id,
        authorName,
        authorTitle,
        content,
        rating,
        source: source as never,
        status: status as never,
        consentGiven,
        consentDate: consentGiven ? new Date() : undefined,
        publishedAt: status === "PUBLISHED" ? new Date() : undefined,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "TESTIMONIAL_CREATED",
        resourceType: "Testimonial",
        resourceId: testimonial.id,
        newValue: { authorName, consentGiven, status: testimonial.status },
      }
    );

    return apiCreated(testimonial);
  } catch (error) {
    logger.error("api.testimonials.create_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to create testimonial");
  }
}
