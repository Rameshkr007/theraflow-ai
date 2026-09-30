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

const createWorkflowSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(400).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).default("ACTIVE"),
  trigger: z.object({
    type: z.enum([
      "NEW_INQUIRY",
      "BOOKING_CREATED",
      "INTAKE_SUBMITTED",
      "APPOINTMENT_24H_BEFORE",
      "SESSION_COMPLETED",
      "SEO_SCORE_DROP",
    ]),
    config: z.record(z.unknown()).optional(),
  }),
  conditions: z
    .array(
      z.object({
        field: z.string(),
        operator: z.enum(["equals", "contains", "greater_than", "is_empty", "is_not_empty"]),
        value: z.unknown(),
      })
    )
    .default([]),
  actions: z.array(
    z.object({
      type: z.enum(["SEND_EMAIL", "SEND_SMS", "NOTIFY_STAFF", "SEND_INTAKE_LINK", "REQUEST_REVIEW"]),
      config: z.record(z.unknown()),
    })
  ),
});

// GET /api/automations - List workflows
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);

  try {
    const [workflows, total] = await Promise.all([
      db.workflow.findMany({
        where: { tenantId },
        include: {
          _count: {
            select: { executions: true },
          },
        },
        orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
        skip,
        take: limit,
      }),
      db.workflow.count({ where: { tenantId } }),
    ]);

    return apiPaginated(workflows, { page, limit, total });
  } catch (error) {
    logger.error("api.automations.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch automations");
  }
}

// POST /api/automations - Create new workflow
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

  const parsed = createWorkflowSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { name, description, status, trigger, conditions, actions } = parsed.data;

  try {
    const workflow = await db.workflow.create({
      data: {
        tenantId,
        name,
        description,
        status: status as never,
        trigger: trigger as import("@prisma/client").Prisma.InputJsonValue,
        conditions: conditions as import("@prisma/client").Prisma.InputJsonValue,
        actions: actions as import("@prisma/client").Prisma.InputJsonValue,
        createdById: userId,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "WORKFLOW_CREATED",
        resourceType: "Workflow",
        resourceId: workflow.id,
        newValue: { name: workflow.name, triggerType: trigger.type },
      }
    );

    return apiCreated(workflow);
  } catch (error) {
    logger.error("api.automations.create_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to create automation workflow");
  }
}
