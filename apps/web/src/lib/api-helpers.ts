/**
 * Shared API utilities for route handlers.
 * Provides a consistent way to extract auth context from requests.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

export interface AuthContext {
  userId: string;
  tenantId: string | undefined;
  role: string | undefined;
  isSuperAdmin: boolean | undefined;
  ip: string;
  userAgent: string | undefined;
}

/**
 * Extract authenticated user context from a request.
 * Returns null if not authenticated.
 */
export async function getAuthContext(
  request: NextRequest
): Promise<AuthContext | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  return {
    userId: session.user.id,
    tenantId: session.user.tenantId,
    role: session.user.role,
    isSuperAdmin: session.user.isSuperAdmin,
    ip,
    userAgent: request.headers.get("user-agent") ?? undefined,
  };
}
