import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { db } from "./db";
import { logger } from "./logger";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extends the default NextAuth session/JWT to include our application data.
 * This means session.user.id, tenantId, role, etc. are available everywhere.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      tenantId?: string;
      role?: string;
      isSuperAdmin?: boolean;
    };
  }

  interface User {
    id: string;
    tenantId?: string;
    role?: string;
    isSuperAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tenantId?: string;
    role?: string;
    isSuperAdmin?: boolean;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ─────────────────────────────────────────────────────────────────────────────
// AUTH OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // Refresh every 24h
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    newUser: "/onboarding",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@practice.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Validate input shape
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          logger.warn("auth.invalid_credentials_shape", {
            ip: req.headers?.["x-forwarded-for"] as string,
          });
          return null;
        }

        const { email, password } = parsed.data;

        try {
          const user = await db.user.findUnique({
            where: { email },
            include: {
              memberships: {
                take: 1,
                orderBy: { createdAt: "asc" },
                include: {
                  tenant: { select: { id: true, status: true, planId: true } },
                },
              },
            },
          });

          if (!user || !user.passwordHash) {
            // Timing-safe: still run compare to prevent timing attacks
            await compare(password, "$2b$12$invalid.hash.for.timing.safety.only");
            logger.warn("auth.user_not_found", { email });
            return null;
          }

          const isValid = await compare(password, user.passwordHash);
          if (!isValid) {
            logger.warn("auth.invalid_password", { userId: user.id });
            return null;
          }

          // Get primary membership
          const membership = user.memberships[0];

          logger.info("auth.login_success", {
            userId: user.id,
            tenantId: membership?.tenantId,
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
            tenantId: membership?.tenantId,
            role: membership?.role,
            isSuperAdmin: user.isSuperAdmin,
          };
        } catch (error) {
          logger.error("auth.authorize_error", {
            error: error instanceof Error ? error : new Error(String(error)),
          });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Called when token is created (login) or refreshed
      if (user) {
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.role = user.role;
        token.isSuperAdmin = user.isSuperAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      // Make token data available on the client session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.tenantId = token.tenantId;
        session.user.role = token.role;
        session.user.isSuperAdmin = token.isSuperAdmin;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      logger.info("auth.sign_in", { userId: user.id });
    },
    async signOut({ token }) {
      logger.info("auth.sign_out", { userId: token?.id });
    },
  },
  debug: process.env.NODE_ENV === "development",
};

// ─────────────────────────────────────────────────────────────────────────────
// SERVER HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the current session on the server.
 * Returns null if not authenticated.
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Get the current session and throw if not authenticated.
 * Use in API routes that require authentication.
 */
export async function requireSession() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Get the current session and require a specific tenant.
 * Throws if not authenticated or tenant doesn't match.
 */
export async function requireTenantSession(tenantId?: string) {
  const session = await requireSession();

  if (tenantId && session.user.tenantId !== tenantId && !session.user.isSuperAdmin) {
    throw new Error("FORBIDDEN");
  }

  return session;
}
