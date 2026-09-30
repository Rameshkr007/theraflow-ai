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

const createFormSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(400).optional(),
  fields: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "textarea", "select", "radio", "checkbox", "scale", "signature", "date"]),
      label: z.string().min(1),
      required: z.boolean().default(false),
      options: z.array(z.string()).optional(),
      helpText: z.string().optional(),
    })
  ),
  isDefault: z.boolean().default(false),
});

// GET /api/intake/forms - List intake forms
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);

  try {
    const [forms, total] = await Promise.all([
      db.intakeForm.findMany({
        where: { tenantId },
        include: {
          _count: {
            select: { submissions: true },
          },
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      db.intakeForm.count({ where: { tenantId } }),
    ]);

    return apiPaginated(forms, { page, limit, total });
  } catch (error) {
    logger.error("api.intake.forms.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch intake forms");
  }
}

// POST /api/intake/forms - Create new intake form
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

  const parsed = createFormSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const practice = await db.practice.findFirst({
      where: { tenantId },
      select: { id: true },
    });

    if (!practice) {
      return apiValidationError("Practice record not found");
    }

    const { name, description, fields, isDefault } = parsed.data;

    if (isDefault) {
      // Unset previous default if setting a new default
      await db.intakeForm.updateMany({
        where: { tenantId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const created = await db.intakeForm.create({
      data: {
        tenantId,
        practiceId: practice.id,
        name,
        description,
        fields: fields as import("@prisma/client").Prisma.InputJsonValue,
        status: "PUBLISHED",
        isDefault,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "INTAKE_FORM_CREATED",
        resourceType: "IntakeForm",
        resourceId: created.id,
        newValue: { name: created.name, isDefault: created.isDefault },
      }
    );

    return apiCreated(created);
  } catch (error) {
    logger.error("api.intake.forms.create_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to create intake form");
  }
}
