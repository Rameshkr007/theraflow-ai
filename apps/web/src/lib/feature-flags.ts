import { env } from "./env";

/**
 * Feature flag system.
 *
 * Resolution order (highest to lowest priority):
 * 1. Per-tenant DB override (passed in as `tenantOverrides`)
 * 2. Global environment variable defaults
 *
 * This allows disabling features globally while enabling them for specific tenants,
 * or enabling them globally while disabling for specific problem tenants.
 */

export interface FeatureFlags {
  ai_copilot: boolean;
  advanced_analytics: boolean;
  experiments: boolean;
  automation: boolean;
  developer_api: boolean;
  white_label: boolean;
}

/**
 * Global defaults from environment variables.
 */
function getGlobalDefaults(): FeatureFlags {
  return {
    ai_copilot: env.FEATURE_AI_COPILOT,
    advanced_analytics: env.FEATURE_ADVANCED_ANALYTICS,
    experiments: env.FEATURE_EXPERIMENTS,
    automation: env.FEATURE_AUTOMATION,
    developer_api: env.FEATURE_DEVELOPER_API,
    white_label: env.FEATURE_WHITE_LABEL,
  };
}

/**
 * Get resolved feature flags for a tenant.
 * Merges global defaults with per-tenant overrides from the database.
 *
 * @param tenantOverrides - The `featureOverrides` JSON field from the Tenant model
 */
export function getFeatureFlags(
  tenantOverrides?: Record<string, boolean> | null
): FeatureFlags {
  const defaults = getGlobalDefaults();
  if (!tenantOverrides) return defaults;

  return {
    ...defaults,
    ...Object.fromEntries(
      Object.entries(tenantOverrides).filter(([key]) =>
        Object.keys(defaults).includes(key)
      )
    ),
  } as FeatureFlags;
}

/**
 * Check if a single feature is enabled for a tenant.
 */
export function isFeatureEnabled(
  flag: keyof FeatureFlags,
  tenantOverrides?: Record<string, boolean> | null
): boolean {
  return getFeatureFlags(tenantOverrides)[flag];
}
