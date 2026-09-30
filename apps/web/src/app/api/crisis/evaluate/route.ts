import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiSuccess, apiValidationError, apiInternalError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const evaluateSchema = z.object({
  text: z.string().min(1),
  source: z.enum(["INQUIRY", "INTAKE", "CHAT", "BOOKING", "PORTAL"]).default("INQUIRY"),
  clientName: z.string().optional(),
  clientContact: z.string().optional(),
  tenantId: z.string().optional(),
});

const IMMINENT_KEYWORDS = [
  "kill myself",
  "suicide",
  "end my life",
  "want to die",
  "hang myself",
  "swallow pills",
  "slit my wrist",
  "saying goodbye",
  "better off dead",
  "no reason to live",
];

const MODERATE_KEYWORDS = [
  "hopeless",
  "can't go on",
  "unbearable pain",
  "self-harm",
  "cutting myself",
  "hurting myself",
  "giving away belongings",
];

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON");
  }

  const parsed = evaluateSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { text, source, clientName, clientContact, tenantId } = parsed.data;
  const lower = text.toLowerCase();

  const foundImminent = IMMINENT_KEYWORDS.filter((kw) => lower.includes(kw));
  const foundModerate = MODERATE_KEYWORDS.filter((kw) => lower.includes(kw));

  let severity: "LOW" | "MODERATE" | "HIGH" | "IMMINENT" = "LOW";
  let isCrisis = false;

  if (foundImminent.length > 0) {
    severity = "IMMINENT";
    isCrisis = true;
  } else if (foundModerate.length > 0) {
    severity = "MODERATE";
    isCrisis = true;
  }

  const detectedKeywords = [...foundImminent, ...foundModerate];

  try {
    // If crisis detected and tenantId provided (or find default demo tenant)
    if (isCrisis) {
      let resolvedTenantId = tenantId;
      if (!resolvedTenantId) {
        const demoTenant = await db.tenant.findFirst({
          where: { slug: "willow-mind-demo" },
          select: { id: true },
        });
        resolvedTenantId = demoTenant?.id;
      }

      if (resolvedTenantId) {
        await db.crisisAlert.create({
          data: {
            tenantId: resolvedTenantId,
            source,
            severity,
            clientName: clientName || "Anonymous Visitor",
            clientContact: clientContact || "Not provided",
            contentSnippet: text.slice(0, 500),
            detectedKeywords,
            riskScore: severity === "IMMINENT" ? 0.95 : 0.65,
            isResolved: false,
          },
        });
      }
    }

    return apiSuccess({
      isCrisis,
      severity,
      detectedKeywords,
      helpline: {
        name: "988 Suicide & Crisis Lifeline",
        phone: "988",
        sms: "Text HOME to 741741",
        description: "Free, confidential 24/7 support across the United States and Canada.",
        internationalUrl: "https://findahelpline.com/",
      },
    });
  } catch (error) {
    logger.error("crisis.evaluate_error", { error: error as Error });
    return apiInternalError("Crisis evaluation failed");
  }
}
