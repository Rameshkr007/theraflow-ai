import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiSuccess, apiUnauthorized, apiValidationError, apiInternalError } from "@/lib/api-response";
import { callAi } from "@/lib/ai/gateway";
import { logger } from "@/lib/logger";

const regenerateSchema = z.object({
  sectionType: z.string(),
  currentContent: z.record(z.unknown()),
  goal: z.enum([
    "warmer",
    "clearer",
    "shorter",
    "more_professional",
    "improve_cta",
    "improve_seo",
    "improve_accessibility",
  ]),
  practiceContext: z
    .object({
      name: z.string().optional(),
      specialties: z.array(z.string()).optional(),
    })
    .optional(),
});

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

  const parsed = regenerateSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { sectionType, currentContent, goal, practiceContext } = parsed.data;

  const goalInstructions: Record<string, string> = {
    warmer: "Make the tone deeply compassionate, safe, welcoming, and destigmatizing for individuals seeking therapy.",
    clearer: "Eliminate clinical jargon, simplify complex sentences, and clarify the core therapeutic value.",
    shorter: "Condense by 40% into punchy, high-impact copy suitable for mobile scanning.",
    more_professional: "Elevate the evidence-based framing, highlighting clinical rigor, credentials, and ethical standards.",
    improve_cta: "Create a psychologically safe call-to-action that reduces commitment anxiety (e.g. 'Start with a gentle 15-minute consultation').",
    improve_seo: "Weave in natural local therapeutic search intent keywords without keyword stuffing.",
    improve_accessibility: "Ensure simple syntactic structures, inclusive pronouns, and crystal-clear headers.",
  };

  try {
    const prompt = `You are an expert mental health clinical copywriter and UX specialist.
Practice Name: ${practiceContext?.name ?? "Therapy Practice"}
Specialties: ${practiceContext?.specialties?.join(", ") ?? "Anxiety, Burnout, Couples Therapy"}
Section Type: ${sectionType}
Improvement Goal: ${goalInstructions[goal]}

CURRENT SECTION CONTENT:
${JSON.stringify(currentContent, null, 2)}

Improve this content according to the goal while strictly preserving the existing JSON structure keys.
Respond with pure JSON:
{
  "improvedContent": <updated JSON object matching the current keys>,
  "explanation": "1-2 sentence explanation of the specific improvements made"
}`;

    const aiRes = await callAi(
      {
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        maxTokens: 1000,
      },
      { tenantId, userId, taskType: "section_regeneration" }
    );

    let improvedContent = currentContent;
    let explanation = "Content refined for warmth and clarity.";

    if (aiRes.content) {
      const match = aiRes.content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const parsedRes = JSON.parse(match[0]);
          if (parsedRes.improvedContent) {
            improvedContent = parsedRes.improvedContent;
          }
          if (parsedRes.explanation) {
            explanation = parsedRes.explanation;
          }
        } catch {
          // Fallback gracefully if parsing fails
        }
      }
    }

    return apiSuccess({
      before: currentContent,
      after: improvedContent,
      goal,
      explanation,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("api.regenerate_section.error", { error: error as Error, tenantId });
    return apiInternalError("Failed to regenerate section content");
  }
}
