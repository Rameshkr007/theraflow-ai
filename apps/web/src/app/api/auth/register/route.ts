import { NextRequest } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import type { PrismaClient } from "@prisma/client";
import {
  apiSuccess,
  apiCreated,
  apiUnauthorized,
  apiForbidden,
  apiNotFound,
  apiValidationError,
  apiInternalError,
  parsePaginationParams,
  apiPaginated,
} from "@/lib/api-response";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { createAuditLog, AuditAction } from "@/lib/audit";
import { logger } from "@/lib/logger";
import { slugify } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number"),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
});

export async function POST(request: NextRequest) {
  // Rate limit registration attempts
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = checkRateLimit(ip, "auth");
  if (!rateLimit.success) {
    return apiUnauthorized("Too many registration attempts. Please try again later.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON body");
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { name, email, password } = parsed.data;

  try {
    // Check if email already exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return apiValidationError({ email: ["An account with this email already exists"] });
    }

    const passwordHash = await hash(password, 12);
    const tenantSlug = slugify(name) + "-" + Math.random().toString(36).slice(2, 7);

    // Create tenant, user, and membership in a transaction
    const { user, tenant } = await db.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      const tenant = await tx.tenant.create({
        data: {
          name: `${name}'s Practice`,
          slug: tenantSlug,
          planId: "starter",
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          memberships: {
            create: {
              tenantId: tenant.id,
              role: "OWNER",
              inviteStatus: "ACCEPTED",
              joinedAt: new Date(),
            },
          },
        },
        select: { id: true, email: true, name: true },
      });

      return { user, tenant };
    });

    logger.info("auth.user_registered", { userId: user.id, tenantId: tenant.id });

    await createAuditLog(
      { tenantId: tenant.id, userId: user.id, userEmail: user.email ?? undefined, ipAddress: ip },
      { action: "USER_REGISTERED" }
    );

    return apiCreated({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    logger.error("auth.register_error", { error: error as Error });
    return apiInternalError("Registration failed. Please try again.");
  }
}
