/**
 * Plan entitlements by subscription tier.
 * Central place for all feature limits — never check hard-coded plan names
 * throughout the application. Always use this service.
 *
 * -1 means unlimited.
 */

export interface PlanEntitlements {
  websites: number;
  teamMembers: number;
  aiRequestsPerMonth: number;
  analyticsRetentionDays: number;
  automations: number;
  integrations: number;
  storageGb: number;
  // Feature flags by plan
  canUseAiCopilot: boolean;
  canUseAdvancedAnalytics: boolean;
  canUseExperiments: boolean;
  canUseAutomation: boolean;
  canUseDeveloperApi: boolean;
  canUseWhiteLabel: boolean;
  canUseCustomDomain: boolean;
  canExportData: boolean;
}

const UNLIMITED = -1;

export const PLAN_ENTITLEMENTS: Record<string, PlanEntitlements> = {
  starter: {
    websites: 1,
    teamMembers: 2,
    aiRequestsPerMonth: 100,
    analyticsRetentionDays: 30,
    automations: 3,
    integrations: 2,
    storageGb: 1,
    canUseAiCopilot: true,
    canUseAdvancedAnalytics: false,
    canUseExperiments: false,
    canUseAutomation: false,
    canUseDeveloperApi: false,
    canUseWhiteLabel: false,
    canUseCustomDomain: false,
    canExportData: false,
  },
  professional: {
    websites: 1,
    teamMembers: 5,
    aiRequestsPerMonth: 500,
    analyticsRetentionDays: 90,
    automations: 10,
    integrations: 10,
    storageGb: 10,
    canUseAiCopilot: true,
    canUseAdvancedAnalytics: true,
    canUseExperiments: true,
    canUseAutomation: true,
    canUseDeveloperApi: false,
    canUseWhiteLabel: false,
    canUseCustomDomain: true,
    canExportData: true,
  },
  growth: {
    websites: 3,
    teamMembers: 15,
    aiRequestsPerMonth: 2000,
    analyticsRetentionDays: 180,
    automations: 50,
    integrations: 25,
    storageGb: 50,
    canUseAiCopilot: true,
    canUseAdvancedAnalytics: true,
    canUseExperiments: true,
    canUseAutomation: true,
    canUseDeveloperApi: true,
    canUseWhiteLabel: false,
    canUseCustomDomain: true,
    canExportData: true,
  },
  enterprise: {
    websites: UNLIMITED,
    teamMembers: UNLIMITED,
    aiRequestsPerMonth: UNLIMITED,
    analyticsRetentionDays: 365,
    automations: UNLIMITED,
    integrations: UNLIMITED,
    storageGb: UNLIMITED,
    canUseAiCopilot: true,
    canUseAdvancedAnalytics: true,
    canUseExperiments: true,
    canUseAutomation: true,
    canUseDeveloperApi: true,
    canUseWhiteLabel: true,
    canUseCustomDomain: true,
    canExportData: true,
  },
};

/**
 * Get entitlements for a plan, falling back to starter if unknown.
 */
export function getEntitlements(planId: string): PlanEntitlements {
  return PLAN_ENTITLEMENTS[planId] ?? PLAN_ENTITLEMENTS.starter;
}

/**
 * Check if a numeric entitlement allows the current usage.
 * -1 (unlimited) always returns true.
 */
export function isWithinLimit(limit: number, currentUsage: number): boolean {
  if (limit === UNLIMITED) return true;
  return currentUsage < limit;
}

/**
 * Get remaining capacity for a numeric entitlement.
 * Returns 'unlimited' for -1 limits.
 */
export function getRemainingUsage(
  limit: number,
  currentUsage: number
): number | "unlimited" {
  if (limit === UNLIMITED) return "unlimited";
  return Math.max(0, limit - currentUsage);
}

/**
 * Check if a boolean feature is enabled for a plan.
 */
export function canUsePlanFeature(
  planId: string,
  feature: keyof PlanEntitlements
): boolean {
  const entitlements = getEntitlements(planId);
  const value = entitlements[feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return false;
}
