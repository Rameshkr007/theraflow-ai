import { z } from "zod";

/**
 * Environment variable validation.
 * Crashes at startup with a clear error if required vars are missing.
 * This prevents silent failures in production.
 */

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("TheraFlow"),
  NEXT_PUBLIC_DEMO_MODE: z.coerce.boolean().default(false),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Auth
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),

  // AI Providers
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_PROVIDER: z.enum(["openai", "anthropic", "mock"]).default("openai"),
  AI_MODEL: z.string().default("gpt-4o-mini"),
  AI_FALLBACK_PROVIDER: z.enum(["openai", "anthropic", "mock"]).optional(),
  AI_FALLBACK_MODEL: z.string().optional(),
  AI_MAX_TOKENS: z.coerce.number().default(2048),
  AI_TEMPERATURE: z.coerce.number().default(0.7),

  // Storage
  STORAGE_PROVIDER: z.enum(["local", "s3", "r2"]).default("local"),
  STORAGE_LOCAL_PATH: z.string().default("./uploads"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // Email
  EMAIL_PROVIDER: z.enum(["console", "smtp", "resend", "sendgrid"]).default("console"),
  EMAIL_FROM: z.string().email().default("noreply@theraflow.app"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Feature Flags (global defaults, per-tenant overrides in DB)
  FEATURE_AI_COPILOT: z.coerce.boolean().default(true),
  FEATURE_ADVANCED_ANALYTICS: z.coerce.boolean().default(true),
  FEATURE_EXPERIMENTS: z.coerce.boolean().default(true),
  FEATURE_AUTOMATION: z.coerce.boolean().default(true),
  FEATURE_DEVELOPER_API: z.coerce.boolean().default(true),
  FEATURE_WHITE_LABEL: z.coerce.boolean().default(false),

  // Observability
  NEXT_PUBLIC_ANALYTICS_ENABLED: z.coerce.boolean().default(true),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // Security
  ENCRYPTION_KEY: z.string().optional(), // For encrypting credentials at rest
  MAX_FILE_SIZE_MB: z.coerce.number().default(10),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, errors]) => `  • ${field}: ${errors?.join(", ")}`)
      .join("\n");

    throw new Error(
      `❌ Invalid environment variables:\n${errorMessages}\n\n` +
        `Please check your .env.local file against .env.example`
    );
  }

  return parsed.data;
}

// Validate once at module load time
export const env = validateEnv();
