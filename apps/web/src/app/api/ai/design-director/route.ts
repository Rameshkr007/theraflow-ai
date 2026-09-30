import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiValidationError, apiInternalError } from "@/lib/api-response";
import { callAi } from "@/lib/ai/gateway";
import { logger } from "@/lib/logger";

const designAuditSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      content: z.record(z.unknown()),
    })
  ),
  pageTitle: z.string().optional(),
});

export interface DesignRecommendation {
  id: string;
  category: "CTA" | "SPACING" | "TYPOGRAPHY" | "ACCESSIBILITY" | "MOBILE" | "HIERARCHY";
  severity: "high" | "medium" | "low";
  title: string;
  problem: string;
  solution: string;
  affectedSectionId?: string;
  patch?: {
    sectionId: string;
    field: string;
    originalValue: unknown;
    recommendedValue: unknown;
  };
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId } = session.user;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON body");
  }

  const parsed = designAuditSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { sections, pageTitle } = parsed.data;

  try {
    // Deterministic rules check first (fast & reliable)
    const recommendations: DesignRecommendation[] = [];

    // 1. Check Hero CTAs
    const heroSection = sections.find((s) => s.type === "hero");
    if (heroSection) {
      const primaryCta = heroSection.content.primaryCta;
      const secondaryCta = heroSection.content.secondaryCta;
      const tertiaryCta = heroSection.content.tertiaryCta;

      if (primaryCta && secondaryCta && tertiaryCta) {
        recommendations.push({
          id: "rec-hero-cta",
          category: "CTA",
          severity: "high",
          title: "Reduce competing actions in Hero",
          problem: "Your hero contains three competing actions. Therapy clients in distress experience choice paralysis.",
          solution: "Simplify to one prominent 'Book Consultation' action and an optional gentle secondary 'Explore Services' link.",
          affectedSectionId: heroSection.id,
          patch: {
            sectionId: heroSection.id,
            field: "tertiaryCta",
            originalValue: tertiaryCta,
            recommendedValue: null,
          },
        });
      }
    }

    // 2. Check for missing Trust indicators right after Hero
    const heroIndex = sections.findIndex((s) => s.type === "hero");
    const trustIndex = sections.findIndex((s) => s.type === "trust");
    if (heroIndex !== -1 && (trustIndex === -1 || trustIndex > heroIndex + 2)) {
      recommendations.push({
        id: "rec-trust-placement",
        category: "HIERARCHY",
        severity: "medium",
        title: "Place Trust Indicators directly below Hero",
        problem: "Vulnerable clients need immediate reassurance of your credentials (licensure, ethics board, verified therapy directories).",
        solution: "Move your verified credentials & accreditations row immediately below the hero to establish safety before asking for commitments.",
      });
    }

    // 3. Check FAQ presence for objection handling
    const hasFaq = sections.some((s) => s.type === "faq");
    if (!hasFaq) {
      recommendations.push({
        id: "rec-faq-missing",
        category: "ACCESSIBILITY",
        severity: "medium",
        title: "Add a FAQ section to resolve hesitation",
        problem: "Clients frequently wonder about fees, insurance superbills, and what the first session feels like.",
        solution: "Add a structured FAQ section answering the top 3-4 therapy onboarding questions.",
      });
    }

    // 4. Check Services section density
    const servicesSection = sections.find((s) => s.type === "services");
    if (servicesSection) {
      const items = Array.isArray(servicesSection.content.items) ? servicesSection.content.items : [];
      if (items.length > 6) {
        recommendations.push({
          id: "rec-services-density",
          category: "MOBILE",
          severity: "medium",
          title: "High visual density in Services section",
          problem: `Showing ${items.length} services simultaneously creates cognitive overload on mobile devices.`,
          solution: "Feature your top 3 core specialties with a secondary 'View All Services' toggle.",
        });
      }
    }

    // AI-augmented analysis if provider available
    try {
      const prompt = `As an expert UX Product Designer for mental health clinics, analyze this therapy practice page structure:
Page Title: ${pageTitle ?? "Homepage"}
Sections: ${JSON.stringify(sections.map((s) => ({ type: s.type, keys: Object.keys(s.content) })))}

Provide 1 subtle, empathetic UX design recommendation specifically targeting therapeutic warmth, readability, or conversion ease. Respond with JSON:
{
  "category": "TYPOGRAPHY" | "SPACING" | "CTA" | "ACCESSIBILITY",
  "severity": "low" | "medium",
  "title": string,
  "problem": string,
  "solution": string
}`;

      const aiRes = await callAi(
        {
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          maxTokens: 500,
        },
        { tenantId, userId, taskType: "design_director" }
      );

      if (aiRes.content) {
        const jsonMatch = aiRes.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiRec = JSON.parse(jsonMatch[0]);
          recommendations.push({
            id: `rec-ai-${Date.now()}`,
            category: aiRec.category ?? "TYPOGRAPHY",
            severity: aiRec.severity ?? "low",
            title: aiRec.title,
            problem: aiRec.problem,
            solution: aiRec.solution,
          });
        }
      }
    } catch {
      // If AI fails, deterministic rules still succeed!
    }

    return apiSuccess({
      recommendations,
      score: Math.max(70, 100 - recommendations.length * 8),
      auditedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("api.design_director.error", { error: error as Error, tenantId });
    return apiInternalError("Failed to complete design audit");
  }
}
