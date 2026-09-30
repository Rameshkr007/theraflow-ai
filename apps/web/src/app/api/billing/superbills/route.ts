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

const createSuperbillSchema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientAddress: z.string().optional(),
  clientDob: z.string().optional(),
  providerName: z.string().default("Dr. Sarah Bennett, PsyD"),
  providerNpi: z.string().default("1841920394"),
  providerTaxId: z.string().default("84-2910394"),
  providerAddress: z.string().default("1204 San Antonio St, Suite 200, Austin, TX 78701"),
  serviceDate: z.string().optional(),
  procedureCode: z.string().default("90834"),
  procedureDescription: z.string().default("Psychotherapy, 45-50 minutes, individual"),
  diagnosisCode: z.string().default("F41.1"),
  secondaryDiagnosis: z.string().optional(),
  amount: z.number().positive(),
  amountPaid: z.number().positive(),
  status: z.enum(["DRAFT", "ISSUED", "PAID", "SUBMITTED", "REIMBURSED"]).default("ISSUED"),
  notes: z.string().optional(),
  bookingId: z.string().optional(),
  clinicalNoteId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");
  const { page, limit, skip } = parsePaginationParams(searchParams);

  try {
    const where = {
      tenantId: session.user.tenantId,
      ...(search
        ? {
            OR: [
              { clientName: { contains: search, mode: "insensitive" as const } },
              { invoiceNumber: { contains: search, mode: "insensitive" as const } },
              { procedureCode: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(status ? { status: status as any } : {}),
    };

    const [superbills, total] = await Promise.all([
      db.superbill.findMany({
        where,
        orderBy: { serviceDate: "desc" },
        skip,
        take: limit,
      }),
      db.superbill.count({ where }),
    ]);

    return apiPaginated(superbills, { page, limit, total });
  } catch (error) {
    logger.error("billing.superbills_get_error", { error: error as Error });
    return apiInternalError("Failed to fetch superbills");
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

  const parsed = createSuperbillSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const data = parsed.data;

  try {
    const count = await db.superbill.count({
      where: { tenantId: session.user.tenantId },
    });
    const invoiceNumber = `SB-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const superbill = await db.superbill.create({
      data: {
        tenantId: session.user.tenantId,
        invoiceNumber,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientAddress: data.clientAddress || "Austin, TX",
        clientDob: data.clientDob || "1994-06-15",
        providerName: data.providerName,
        providerNpi: data.providerNpi,
        providerTaxId: data.providerTaxId,
        providerAddress: data.providerAddress,
        serviceDate: data.serviceDate ? new Date(data.serviceDate) : new Date(),
        procedureCode: data.procedureCode,
        procedureDescription: data.procedureDescription,
        diagnosisCode: data.diagnosisCode,
        secondaryDiagnosis: data.secondaryDiagnosis || null,
        amount: data.amount,
        amountPaid: data.amountPaid,
        status: data.status,
        notes: data.notes || "Standard CMS-1500 out-of-network reimbursement document.",
        bookingId: data.bookingId || null,
        clinicalNoteId: data.clinicalNoteId || null,
        issuedAt: new Date(),
      },
    });

    await createAuditLog(
      {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        userEmail: session.user.email ?? undefined,
      },
      {
        action: "BILLING_UPDATE",
        resourceType: "Superbill",
        resourceId: superbill.id,
        metadata: { invoiceNumber: superbill.invoiceNumber, amount: superbill.amount },
      }
    );

    return apiCreated(superbill);
  } catch (error) {
    logger.error("billing.create_superbill_error", { error: error as Error });
    return apiInternalError("Failed to create superbill");
  }
}
