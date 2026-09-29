import { env } from "./env";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  tenantId?: string;
  userId?: string;
  requestId?: string;
  duration?: number;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL PRIORITY
// ─────────────────────────────────────────────────────────────────────────────

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  const configuredLevel = (env.LOG_LEVEL ?? "info") as LogLevel;
  return LEVELS[level] >= LEVELS[configuredLevel];
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGGER
// ─────────────────────────────────────────────────────────────────────────────

function formatEntry(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    // Structured JSON for log aggregation
    return JSON.stringify(entry);
  }
  // Human-readable in development
  const { timestamp, level, event, error, ...rest } = entry;
  const prefix = `[${timestamp}] ${level.toUpperCase().padEnd(5)} ${event}`;
  const extras = Object.keys(rest).length > 0 ? ` ${JSON.stringify(rest)}` : "";
  const errorStr = error ? `\n  Error: ${error.message}${error.stack ? `\n${error.stack}` : ""}` : "";
  return `${prefix}${extras}${errorStr}`;
}

function log(
  level: LogLevel,
  event: string,
  context?: Record<string, unknown> & {
    error?: Error;
    tenantId?: string;
    userId?: string;
    requestId?: string;
    duration?: number;
  }
): void {
  if (!shouldLog(level)) return;

  const { error, ...rest } = context ?? {};

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...rest,
    ...(error
      ? {
          error: {
            message: error.message,
            stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
            code: (error as NodeJS.ErrnoException).code,
          },
        }
      : {}),
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case "debug":
      console.debug(formatted);
      break;
    case "info":
      console.info(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    case "error":
      console.error(formatted);
      break;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export const logger = {
  debug: (event: string, context?: Parameters<typeof log>[2]) => log("debug", event, context),
  info: (event: string, context?: Parameters<typeof log>[2]) => log("info", event, context),
  warn: (event: string, context?: Parameters<typeof log>[2]) => log("warn", event, context),
  error: (event: string, context?: Parameters<typeof log>[2]) => log("error", event, context),

  /** Create a child logger with fixed context (e.g., tenantId, requestId) */
  child(fixedContext: { tenantId?: string; userId?: string; requestId?: string }) {
    return {
      debug: (event: string, ctx?: Parameters<typeof log>[2]) =>
        log("debug", event, { ...fixedContext, ...ctx }),
      info: (event: string, ctx?: Parameters<typeof log>[2]) =>
        log("info", event, { ...fixedContext, ...ctx }),
      warn: (event: string, ctx?: Parameters<typeof log>[2]) =>
        log("warn", event, { ...fixedContext, ...ctx }),
      error: (event: string, ctx?: Parameters<typeof log>[2]) =>
        log("error", event, { ...fixedContext, ...ctx }),
    };
  },
};
