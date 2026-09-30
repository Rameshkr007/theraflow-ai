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

const createIntegrationSchema = z.object({
  provider: z.string().min(2).max(80),
  category: z.enum([
    "CALENDAR",
    "EMAIL",
    "PAYMENTS",
    "ANALYTICS",
    "BOOKING",
    "STORAGE",
    "CRM",
    "VIDEO",
    "SEARCH",
  ]),
  status: z.enum(["CONNECTED", "DISCONNECTED", "ERROR", "NEEDS_ATTENTION"]).default("CONNECTED"),
  config: z.record(z.unknown()).default({}),
});

// GET /api/integrations - List integrations
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);

  try {
    const [integrations, total] = await Promise.all([
      db.integration.findMany({
        where: { tenantId },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      db.integration.count({ where: { tenantId } }),
    ]);

    return apiPaginated(integrations, { page, limit, total });
  } catch (error) {
    logger.error("api.integrations.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch integrations");
  }
}

// POST /api/integrations - Connect or upsert integration
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

  const parsed = createIntegrationSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { provider, category, status, config } = parsed.data;

  try {
    const integration = await db.integration.upsert({
      where: {
        tenantId_provider: {
          tenantId,
          provider,
        },
      },
      update: {
        status: status as never,
        category: category as never,
        config: config as import("@prisma/client").Prisma.InputJsonValue,
        lastSyncAt: status === "CONNECTED" ? new Date() : undefined,
      },
      create: {
        tenantId,
        provider,
        category: category as never,
        status: status as never,
        config: config as import("@prisma/client").Prisma.InputJsonValue,
        lastSyncAt: status === "CONNECTED" ? new Date() : undefined,
        createdById: userId,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: status === "CONNECTED" ? "INTEGRATION_CONNECTED" : "INTEGRATION_UPDATED",
        resourceType: "Integration",
        resourceId: integration.id,
        newValue: { provider, status },
      }
    );

    return apiCreated(integration);
  } catch (error) {
    logger.error("api.integrations.post_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to configure integration");
  }
}
