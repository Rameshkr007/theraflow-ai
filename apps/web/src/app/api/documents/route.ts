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

const createDocumentSchema = z.object({
  name: z.string().min(1).max(200),
  originalName: z.string().min(1).max(200),
  mimeType: z.string().default("application/pdf"),
  size: z.number().int().positive(),
  extractedText: z.string().optional(),
});

// GET /api/documents - List uploaded practice documents
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);

  try {
    const [docs, total] = await Promise.all([
      db.document.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.document.count({ where: { tenantId } }),
    ]);

    return apiPaginated(docs, { page, limit, total });
  } catch (error) {
    logger.error("api.documents.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch documents");
  }
}

// POST /api/documents - Register and process a new practice document
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

  const parsed = createDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  try {
    const practice = await db.practice.findFirst({
      where: { tenantId },
      select: { id: true },
    });

    if (!practice) {
      return apiValidationError("Practice record not found for tenant");
    }

    const { name, originalName, mimeType, size, extractedText } = parsed.data;

    // Simulate virus scan and text chunking
    const chunkCount = Math.max(1, Math.ceil((extractedText?.length || 500) / 400));
    const storageKey = `docs/${tenantId}/${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const doc = await db.document.create({
      data: {
        tenantId,
        practiceId: practice.id,
        name,
        originalName,
        mimeType,
        size,
        storageKey,
        storageProvider: "local",
        processingStatus: "COMPLETE",
        extractedText:
          extractedText ??
          `Extracted clinical content from ${originalName}: Practice policies, session protocols, and consent disclosures.`,
        chunkCount,
        virusScanStatus: "CLEAN",
        isPublic: false, // Never automatically public!
        uploadedById: userId,
      },
    });

    // Also scaffold a pending KnowledgeItem in REVIEW status from this document
    await db.knowledgeItem.create({
      data: {
        tenantId,
        practiceId: practice.id,
        title: `Document Knowledge: ${name}`,
        content: doc.extractedText || "Awaiting clinician approval for AI retrieval.",
        type: "POLICY",
        source: "DOCUMENT",
        status: "REVIEW", // Requires human review before available to public AI
        ownerId: userId,
        version: 1,
      },
    });

    await createAuditLog(
      { tenantId, userId, userEmail: userEmail ?? undefined },
      {
        action: "DOCUMENT_UPLOADED",
        resourceType: "Document",
        resourceId: doc.id,
        newValue: { name: doc.name, size: doc.size, virusScanStatus: doc.virusScanStatus },
      }
    );

    return apiCreated(doc);
  } catch (error) {
    logger.error("api.documents.create_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to process document");
  }
}
