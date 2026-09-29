import { db } from "./db";
import { logger } from "./logger";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Create an immutable audit log entry.
 *
 * Audit logs should never be deleted or updated. They represent
 * an accurate historical record of what happened in the system.
 *
 * Use this for:
 * - Authentication events (login, logout, password change)
 * - Content changes (publish, delete, update)
 * - AI actions (approved, rejected)
 * - Permission changes
 * - Billing events
 * - Integration changes
 * - API key creation/revocation
 */

export interface AuditContext {
  tenantId: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditEntry {
  action: string;
  resourceType?: string;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown>;
}

export async function createAuditLog(
  context: AuditContext,
  entry: AuditEntry
): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        tenantId: context.tenantId,
        userId: context.userId,
        userEmail: context.userEmail,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        oldValue: entry.oldValue !== undefined ? JSON.parse(JSON.stringify(entry.oldValue)) : undefined,
        newValue: entry.newValue !== undefined ? JSON.parse(JSON.stringify(entry.newValue)) : undefined,
        metadata: entry.metadata,
      },
    });
  } catch (error) {
    // Audit logging failures should never crash the application.
    // Log the error but don't propagate it.
    logger.error("audit_log_failed", {
      error: error instanceof Error ? error : new Error(String(error)),
      tenantId: context.tenantId,
      action: entry.action,
    });
  }
}

/**
 * Server-side helper: create audit log from the current session.
 * Use this in API route handlers where a session is available.
 */
export async function auditFromSession(
  tenantId: string,
  entry: AuditEntry,
  request?: Request
): Promise<void> {
  const session = await getServerSession(authOptions);

  const ipAddress = request
    ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined
    : undefined;

  const userAgent = request
    ? request.headers.get("user-agent") ?? undefined
    : undefined;

  await createAuditLog(
    {
      tenantId,
      userId: session?.user?.id,
      userEmail: session?.user?.email ?? undefined,
      ipAddress,
      userAgent,
    },
    entry
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WELL-KNOWN ACTION CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const AuditAction = {
  // Auth
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  USER_LOGIN_FAILED: "USER_LOGIN_FAILED",
  USER_PASSWORD_CHANGED: "USER_PASSWORD_CHANGED",
  USER_PASSWORD_RESET: "USER_PASSWORD_RESET",
  USER_MFA_ENABLED: "USER_MFA_ENABLED",
  USER_MFA_DISABLED: "USER_MFA_DISABLED",
  SESSION_REVOKED: "SESSION_REVOKED",

  // Content
  PAGE_CREATED: "PAGE_CREATED",
  PAGE_UPDATED: "PAGE_UPDATED",
  PAGE_PUBLISHED: "PAGE_PUBLISHED",
  PAGE_UNPUBLISHED: "PAGE_UNPUBLISHED",
  PAGE_DELETED: "PAGE_DELETED",
  PAGE_RESTORED: "PAGE_RESTORED",

  // Website
  WEBSITE_PUBLISHED: "WEBSITE_PUBLISHED",
  WEBSITE_SETTINGS_UPDATED: "WEBSITE_SETTINGS_UPDATED",

  // Bookings
  BOOKING_CREATED: "BOOKING_CREATED",
  BOOKING_CONFIRMED: "BOOKING_CONFIRMED",
  BOOKING_CANCELLED: "BOOKING_CANCELLED",
  BOOKING_COMPLETED: "BOOKING_COMPLETED",

  // Inquiries
  INQUIRY_REPLIED: "INQUIRY_REPLIED",
  INQUIRY_ARCHIVED: "INQUIRY_ARCHIVED",
  INQUIRY_MARKED_SPAM: "INQUIRY_MARKED_SPAM",

  // AI
  AI_ACTION_APPROVED: "AI_ACTION_APPROVED",
  AI_ACTION_REJECTED: "AI_ACTION_REJECTED",
  AI_ACTION_EXECUTED: "AI_ACTION_EXECUTED",

  // Team
  MEMBER_INVITED: "MEMBER_INVITED",
  MEMBER_ROLE_CHANGED: "MEMBER_ROLE_CHANGED",
  MEMBER_REMOVED: "MEMBER_REMOVED",

  // Integrations
  INTEGRATION_CONNECTED: "INTEGRATION_CONNECTED",
  INTEGRATION_DISCONNECTED: "INTEGRATION_DISCONNECTED",

  // API Keys
  API_KEY_CREATED: "API_KEY_CREATED",
  API_KEY_REVOKED: "API_KEY_REVOKED",

  // Knowledge
  KNOWLEDGE_ITEM_APPROVED: "KNOWLEDGE_ITEM_APPROVED",
  KNOWLEDGE_ITEM_ARCHIVED: "KNOWLEDGE_ITEM_ARCHIVED",

  // Data
  DATA_EXPORTED: "DATA_EXPORTED",
  ACCOUNT_DELETION_REQUESTED: "ACCOUNT_DELETION_REQUESTED",
} as const;
