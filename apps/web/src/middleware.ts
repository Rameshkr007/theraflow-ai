import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { nanoid } from "nanoid";

/**
 * Next.js middleware.
 *
 * Responsibilities:
 * 1. Inject request ID for observability
 * 2. Set security headers on all responses
 * 3. Protect /dashboard/* routes (require auth)
 * 4. Protect /admin/* routes (require super admin)
 * 5. Block indexing of admin/dashboard routes
 */

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Relax for Next.js dev; tighten in prod
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.openai.com https://api.anthropic.com",
    "frame-ancestors 'none'",
  ].join("; "),
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Inject request ID for distributed tracing
  const requestId = nanoid(12);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  // 2. Get JWT token (doesn't hit the database)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 3. Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Protect super admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!token.isSuperAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 5. Redirect authenticated users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Build response
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 6. Apply security headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // 7. Propagate request ID to response for client correlation
  response.headers.set("x-request-id", requestId);

  // 8. Prevent indexing of private routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/")
  ) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - Static files (_next/static, _next/image)
     * - Favicon
     * - Public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
