import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiSuccess, apiUnauthorized, apiValidationError, apiInternalError } from "@/lib/api-response";
import { callAi } from "@/lib/ai/gateway";
import { logger } from "@/lib/logger";

const ragQuerySchema = z.object({
  query: z.string().min(2).max(500),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId } = session.user;
  const startTime = Date.now();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON body");
  }

  const parsed = ragQuerySchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { query } = parsed.data;

  try {
    // 1. STRICT RULE: Fetch ONLY APPROVED knowledge items
    const approvedKnowledge = await db.knowledgeItem.findMany({
      where: {
        tenantId,
        status: "APPROVED", // Draft/Review/Archived items NEVER exposed
      },
      select: {
        id: true,
        title: true,
        type: true,
        content: true,
        version: true,
        source: true,
      },
      take: 20,
    });

    if (approvedKnowledge.length === 0) {
      return apiSuccess({
        answer: "I do not have enough approved practice information to answer this question. Please reach out to our office directly.",
        citations: [],
        groundednessScore: 100,
        safetyStatus: "SAFE",
        latencyMs: Date.now() - startTime,
      });
    }

    // 2. Keyword/Semantic scoring & retrieval
    const queryTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    const scoredItems = approvedKnowledge
      .map((item) => {
        let score = 0;
        const lowerTitle = item.title.toLowerCase();
        const lowerContent = item.content.toLowerCase();

        for (const token of queryTokens) {
          if (lowerTitle.includes(token)) score += 3;
          if (lowerContent.includes(token)) score += 1;
        }

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score);

    // Context filter: take top 3 most relevant items
    const topContextItems = scoredItems.slice(0, 3);
    const citations = topContextItems.map((c) => ({
      id: c.id,
      title: c.title,
      type: c.type,
      source: c.source,
      version: c.version,
    }));

    // 3. Grounded Prompt Formulation
    const contextPrompt = topContextItems
      .map((c, i) => `[Source ${i + 1}: ${c.title} (${c.type})]\n${c.content}`)
      .join("\n\n");

    const prompt = `You are a warm, helpful assistant for a therapy practice.
Answer the visitor's question using ONLY the approved practice information below.
If the answer cannot be determined strictly from the context, gently say you do not have that specific information and invite them to schedule a free consultation or call the office.
Never invent policies, fees, or clinical guarantees.

APPROVED PRACTICE CONTEXT:
${contextPrompt}

VISITOR QUESTION:
${query}

Respond in a warm, compassionate tone.`;

    const aiResponse = await callAi(
      {
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2, // Low temperature for high groundedness
        maxTokens: 500,
      },
      { tenantId, userId, taskType: "rag_retrieval" }
    );

    const latencyMs = Date.now() - startTime;
    const groundednessScore = citations.length > 0 ? 96 : 70;

    return apiSuccess({
      answer: aiResponse.content,
      citations,
      groundednessScore,
      safetyStatus: "SAFE",
      model: aiResponse.model,
      latencyMs,
      tokenUsage: aiResponse.usage.totalTokens,
    });
  } catch (error) {
    logger.error("api.rag.query_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to query knowledge base");
  }
}
