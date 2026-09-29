import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { callAi, getAiErrorMessage } from "@/lib/ai/gateway";
import { readTools, AGENT_TOOL_DEFINITIONS } from "@/lib/ai/tools";
import { db } from "@/lib/db";
import {
  apiUnauthorized,
  apiValidationError,
  apiInternalError,
  apiSuccess,
} from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(4000),
    })
  ),
  conversationId: z.string().cuid().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/chat
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Auth
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId } = {
    tenantId: session.user.tenantId,
    id: session.user.id,
  };

  // Rate limit: AI endpoints have stricter limits
  const rateLimit = checkRateLimit(`${tenantId}:ai`, "ai");
  if (!rateLimit.success) {
    return NextResponse.json(
      { success: false, error: { code: "RATE_LIMITED", message: "Too many AI requests. Please wait before sending another message." } },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiValidationError("Invalid JSON body");
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return apiValidationError(parsed.error.flatten().fieldErrors);
  }

  const { messages, conversationId } = parsed.data;

  try {
    // Get practice context for the system prompt
    const practice = await db.practice.findFirst({
      where: { tenantId },
      select: { name: true, type: true, tagline: true },
    });

    const systemPrompt = [
      "You are the TheraFlow AI Copilot — an intelligent assistant for practice administrators.",
      "",
      `Practice: ${practice?.name ?? "This Practice"}`,
      practice?.tagline ? `Tagline: ${practice.tagline}` : "",
      "",
      "You have access to tools to check real practice data. Use them to answer questions accurately.",
      "You CANNOT directly modify data. For any changes, create a draft action for human review.",
      "Always be specific and actionable. When asked about metrics, call the analytics tool.",
    ].filter(Boolean).join("\n");

    const fullMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages,
    ];

    const toolContext = { tenantId, userId };
    let currentMessages = fullMessages;
    let iterations = 0;
    const MAX_ITERATIONS = 3;
    let finalResponse;

    // Tool execution loop
    while (iterations < MAX_ITERATIONS) {
      const aiResponse = await callAi(
        {
          messages: currentMessages,
          tools: AGENT_TOOL_DEFINITIONS,
          temperature: 0.4,
          maxTokens: 1024,
        },
        { tenantId, userId, taskType: "copilot_chat" }
      );

      iterations++;

      if (!aiResponse.toolCalls || aiResponse.toolCalls.length === 0) {
        // No more tool calls — final response
        finalResponse = aiResponse;
        break;
      }

      // Execute tool calls
      const toolResults: Array<{ role: "user"; content: string }> = [];

      for (const toolCall of aiResponse.toolCalls) {
        let result: unknown;

        switch (toolCall.name) {
          case "getPractice":
            result = await readTools.getPractice(toolContext);
            break;
          case "getWebsite":
            result = await readTools.getWebsite(toolContext);
            break;
          case "getPages":
            result = await readTools.getPages(toolContext);
            break;
          case "getAnalyticsSummary":
            result = await readTools.getAnalyticsSummary(toolContext);
            break;
          case "getBookings":
            result = await readTools.getBookings(toolContext, toolCall.arguments as Record<string, unknown>);
            break;
          case "getInquiries":
            result = await readTools.getInquiries(toolContext, toolCall.arguments as Record<string, unknown>);
            break;
          case "getSiteHealth":
            result = await readTools.getSiteHealth(toolContext);
            break;
          default:
            result = { success: false, error: `Unknown tool: ${toolCall.name}` };
        }

        toolResults.push({
          role: "user",
          content: `Tool result for ${toolCall.name}: ${JSON.stringify(result)}`,
        });
      }

      // Add AI response with tool calls + tool results to conversation
      currentMessages = [
        ...currentMessages,
        { role: "assistant" as const, content: aiResponse.content || "[Tool calls made]" },
        ...toolResults,
      ];

      finalResponse = aiResponse;
    }

    // Save conversation to DB (best effort - don't fail if this errors)
    try {
      if (conversationId) {
        await db.aiConversation.update({
          where: { id: conversationId, tenantId },
          data: {
            messages: currentMessages,
            totalTokens: finalResponse?.usage.totalTokens,
            estimatedCost: finalResponse?.usage.estimatedCostUsd,
            updatedAt: new Date(),
          },
        });
      }
    } catch (saveError) {
      logger.warn("ai.chat.save_failed", { error: saveError as Error, tenantId });
    }

    return apiSuccess({
      content: finalResponse?.content ?? "",
      model: finalResponse?.model,
      usage: finalResponse?.usage,
    });
  } catch (error) {
    const userMessage = getAiErrorMessage(error);
    logger.error("ai.chat.error", { error: error as Error, tenantId });
    return apiInternalError(userMessage);
  }
}
