import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  apiSuccess,
  apiCreated,
  apiUnauthorized,
  apiForbidden,
  apiValidationError,
  apiInternalError,
  parsePaginationParams,
  apiPaginated,
} from "@/lib/api-response";
import { createAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";

const inviteMemberSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "EDITOR", "STAFF", "VIEWER"]).default("STAFF"),
  title: z.string().max(100).optional(),
});

// GET /api/team - List team memberships
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);

  try {
    const [memberships, total] = await Promise.all([
      db.tenantMembership.findMany({
        where: { tenantId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      db.tenantMembership.count({ where: { tenantId } }),
    ]);

    return apiPaginated(memberships, { page, limit, total });
  } catch (error) {
    logger.error("api.team.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch team members");
  }
}

// POST /api/team - Invite team member
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  // Only OWNER or ADMIN can invite
  if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
    return apiForbidden("Only practice owners and admins can invite team members");
  }

  const { tenantId, id: userId, email: userEmail } = session.user;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON body");
  }

  const parsed = inviteMemberSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { email, name, role, title } = parsed.data;

  try {
    // Upsert user if doesn't exist
    const user = await db.user.upsert({
      where: { email },
      update: { name },
      create: {
        email,
        name,
        passwordHash: "INVITED_PENDING_ACTIVATION",
      },
    });

    const membership = await db.tenantMembership.upsert({
      where: {
        tenantId_userId: {
          tenantId,
          userId: user.id,
        },
      },
      update: {
        role: role as never,
        inviteStatus: "ACCEPTED",
      },
      create: {
        tenantId,
        userId: user.id,
        role: role as never,
        inviteStatus: "ACCEPTED",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "TEAM_MEMBER_INVITED",
        resourceType: "TenantMembership",
        resourceId: membership.id,
        newValue: { email, role, title },
      }
    );

    return apiCreated(membership);
  } catch (error) {
    logger.error("api.team.invite_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to invite team member");
  }
}
