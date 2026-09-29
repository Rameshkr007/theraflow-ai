import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiPaginatedResponse<T = unknown> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─────────────────────────────────────────────────────────────────────────────
// ERROR CODES
// ─────────────────────────────────────────────────────────────────────────────

export const ErrorCode = {
  // Auth
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",

  // Resources
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  CONFLICT: "CONFLICT",

  // Rate limiting
  RATE_LIMITED: "RATE_LIMITED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",

  // AI
  AI_UNAVAILABLE: "AI_UNAVAILABLE",
  AI_CONTENT_BLOCKED: "AI_CONTENT_BLOCKED",

  // System
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  IDEMPOTENCY_CONFLICT: "IDEMPOTENCY_CONFLICT",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiCreated<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function apiPaginated<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number }
): NextResponse<ApiPaginatedResponse<T>> {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  });
}

export function apiError(
  code: ErrorCodeType,
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );
}

export function apiUnauthorized(message = "Authentication required"): NextResponse<ApiErrorResponse> {
  return apiError(ErrorCode.UNAUTHORIZED, message, 401);
}

export function apiForbidden(message = "Insufficient permissions"): NextResponse<ApiErrorResponse> {
  return apiError(ErrorCode.FORBIDDEN, message, 403);
}

export function apiNotFound(resource = "Resource"): NextResponse<ApiErrorResponse> {
  return apiError(ErrorCode.NOT_FOUND, `${resource} not found`, 404);
}

export function apiValidationError(details: unknown): NextResponse<ApiErrorResponse> {
  return apiError(ErrorCode.VALIDATION_ERROR, "Validation failed", 422, details);
}

export function apiRateLimited(retryAfter?: number): NextResponse<ApiErrorResponse> {
  const headers: Record<string, string> = {};
  if (retryAfter) {
    headers["Retry-After"] = retryAfter.toString();
    headers["X-RateLimit-Reset"] = (Math.floor(Date.now() / 1000) + retryAfter).toString();
  }
  return NextResponse.json(
    { success: false, error: { code: ErrorCode.RATE_LIMITED, message: "Too many requests" } },
    { status: 429, headers }
  );
}

export function apiInternalError(message = "An unexpected error occurred"): NextResponse<ApiErrorResponse> {
  return apiError(ErrorCode.INTERNAL_ERROR, message, 500);
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function parsePaginationParams(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
