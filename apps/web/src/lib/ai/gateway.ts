import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
}

export interface AiRequestOptions {
  messages: AiMessage[];
  tools?: AiTool[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
  provider?: "openai" | "anthropic" | "mock";
  stream?: boolean;
  systemPrompt?: string;
}

export interface AiResponse {
  content: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, unknown>;
    id: string;
  }>;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
  model: string;
  provider: string;
  latencyMs: number;
}

export class AiError extends Error {
  constructor(
    message: string,
    public readonly code: "UNAVAILABLE" | "RATE_LIMITED" | "CONTENT_BLOCKED" | "INVALID_KEY" | "UNKNOWN",
    public readonly provider: string
  ) {
    super(message);
    this.name = "AiError";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COST ESTIMATION (approximate, for tracking)
// ─────────────────────────────────────────────────────────────────────────────

const COST_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 0.0025, output: 0.01 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  "claude-3-5-sonnet-20241022": { input: 0.003, output: 0.015 },
  "claude-3-haiku-20240307": { input: 0.00025, output: 0.00125 },
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const rates = COST_PER_1K_TOKENS[model];
  if (!rates) return 0;
  return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENAI PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

async function callOpenAI(options: AiRequestOptions): Promise<AiResponse> {
  const { messages, tools, temperature, maxTokens, model = "gpt-4o-mini" } = options;

  if (!env.OPENAI_API_KEY) {
    throw new AiError("OpenAI API key not configured", "INVALID_KEY", "openai");
  }

  const startTime = Date.now();

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: temperature ?? env.AI_TEMPERATURE,
    max_tokens: maxTokens ?? env.AI_MAX_TOKENS,
  };

  if (tools && tools.length > 0) {
    body.tools = tools.map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));
    body.tool_choice = "auto";
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000), // 30s timeout
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new AiError("OpenAI rate limit exceeded", "RATE_LIMITED", "openai");
    }
    if (response.status === 401) {
      throw new AiError("Invalid OpenAI API key", "INVALID_KEY", "openai");
    }
    throw new AiError(
      `OpenAI error: ${error.error?.message ?? response.statusText}`,
      "UNKNOWN",
      "openai"
    );
  }

  const data = await response.json();
  const choice = data.choices[0];
  const usage = data.usage;
  const latencyMs = Date.now() - startTime;

  return {
    content: choice.message.content ?? "",
    toolCalls: choice.message.tool_calls?.map((tc: Record<string, unknown>) => {
      const fn = tc.function as { name: string; arguments: string };
      return {
        name: fn.name,
        arguments: JSON.parse(fn.arguments),
        id: tc.id as string,
      };
    }),
    usage: {
      inputTokens: usage.prompt_tokens,
      outputTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      estimatedCostUsd: estimateCost(model, usage.prompt_tokens, usage.completion_tokens),
    },
    model,
    provider: "openai",
    latencyMs,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANTHROPIC PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

async function callAnthropic(options: AiRequestOptions): Promise<AiResponse> {
  const {
    messages,
    temperature,
    maxTokens,
    model = "claude-3-haiku-20240307",
    systemPrompt,
  } = options;

  if (!env.ANTHROPIC_API_KEY) {
    throw new AiError("Anthropic API key not configured", "INVALID_KEY", "anthropic");
  }

  const startTime = Date.now();

  // Anthropic uses separate system parameter
  const anthropicMessages = messages.filter((m) => m.role !== "system");
  const system =
    systemPrompt ??
    messages.find((m) => m.role === "system")?.content;

  const body: Record<string, unknown> = {
    model,
    messages: anthropicMessages,
    max_tokens: maxTokens ?? env.AI_MAX_TOKENS,
    temperature: temperature ?? env.AI_TEMPERATURE,
    ...(system ? { system } : {}),
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new AiError("Anthropic rate limit exceeded", "RATE_LIMITED", "anthropic");
    }
    throw new AiError(
      `Anthropic error: ${error.error?.message ?? response.statusText}`,
      "UNKNOWN",
      "anthropic"
    );
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;

  return {
    content: data.content[0]?.text ?? "",
    usage: {
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
      totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      estimatedCostUsd: estimateCost(
        model,
        data.usage.input_tokens,
        data.usage.output_tokens
      ),
    },
    model,
    provider: "anthropic",
    latencyMs,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK PROVIDER (for development/testing without API keys)
// ─────────────────────────────────────────────────────────────────────────────

async function callMock(options: AiRequestOptions): Promise<AiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

  const lastUserMessage = options.messages
    .filter((m) => m.role === "user")
    .at(-1)?.content ?? "";

  return {
    content: `[Mock AI Response] I received your message: "${lastUserMessage.slice(0, 100)}". In production, this would be a real AI response.`,
    usage: {
      inputTokens: 50,
      outputTokens: 30,
      totalTokens: 80,
      estimatedCostUsd: 0,
    },
    model: "mock",
    provider: "mock",
    latencyMs: 250,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AI GATEWAY — with fallback
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main AI Gateway.
 *
 * Tries the configured primary provider first.
 * Falls back to secondary provider if primary fails.
 * Falls back to mock if all providers fail (in development).
 *
 * Never exposes raw provider errors to users.
 */
export async function callAi(
  options: AiRequestOptions,
  context?: { tenantId?: string; userId?: string; taskType?: string }
): Promise<AiResponse> {
  const primaryProvider = options.provider ?? (env.AI_PROVIDER as "openai" | "anthropic" | "mock");
  const primaryModel = options.model ?? env.AI_MODEL;

  const providers = [
    { provider: primaryProvider, model: primaryModel },
    ...(env.AI_FALLBACK_PROVIDER && env.AI_FALLBACK_PROVIDER !== primaryProvider
      ? [{ provider: env.AI_FALLBACK_PROVIDER as "openai" | "anthropic" | "mock", model: env.AI_FALLBACK_MODEL ?? primaryModel }]
      : []),
  ];

  let lastError: AiError | null = null;

  for (const { provider, model } of providers) {
    try {
      logger.info("ai.request", {
        provider,
        model,
        taskType: context?.taskType,
        tenantId: context?.tenantId,
      });

      const requestOptions = { ...options, provider, model };
      let result: AiResponse;

      switch (provider) {
        case "openai":
          result = await callOpenAI(requestOptions);
          break;
        case "anthropic":
          result = await callAnthropic(requestOptions);
          break;
        case "mock":
          result = await callMock(requestOptions);
          break;
        default:
          throw new AiError(`Unknown provider: ${provider}`, "UNKNOWN", provider);
      }

      logger.info("ai.response", {
        provider,
        model,
        latencyMs: result.latencyMs,
        totalTokens: result.usage.totalTokens,
        estimatedCostUsd: result.usage.estimatedCostUsd,
        tenantId: context?.tenantId,
      });

      return result;
    } catch (error) {
      lastError = error instanceof AiError ? error : new AiError(
        error instanceof Error ? error.message : "Unknown error",
        "UNKNOWN",
        provider
      );

      logger.warn("ai.provider_failed", {
        provider,
        model,
        error: lastError,
        tenantId: context?.tenantId,
        willRetry: providers.indexOf({ provider, model }) < providers.length - 1,
      });

      // Don't retry for auth/config errors
      if (lastError.code === "INVALID_KEY") break;
    }
  }

  // All providers failed - use mock in development, throw in production
  if (process.env.NODE_ENV !== "production") {
    logger.warn("ai.using_mock_fallback", { tenantId: context?.tenantId });
    return callMock(options);
  }

  throw lastError ?? new AiError("All AI providers unavailable", "UNAVAILABLE", "gateway");
}

/**
 * User-facing error message when AI is unavailable.
 * Never expose raw errors to end users.
 */
export function getAiErrorMessage(error: unknown): string {
  if (error instanceof AiError) {
    switch (error.code) {
      case "RATE_LIMITED":
        return "We're experiencing high demand. Please try again in a moment.";
      case "CONTENT_BLOCKED":
        return "That content couldn't be processed. Please rephrase and try again.";
      default:
        return "We couldn't generate that suggestion right now. Please try again.";
    }
  }
  return "We couldn't generate that suggestion right now. Please try again.";
}
