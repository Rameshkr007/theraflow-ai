/**
 * AI Agent Tool System
 *
 * Deterministic tools that AI agents can call instead of hallucinating state.
 * Tools are divided into READ (safe) and WRITE (require approval).
 *
 * ARCHITECTURE PRINCIPLE:
 * - All READ tools return real data from the database
 * - All WRITE tools create a pending AiAction that requires human approval
 * - No AI agent can directly modify production data
 */

import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolContext {
  tenantId: string;
  userId: string;
  practiceId?: string;
}

export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// READ TOOLS (safe, no side effects)
// ─────────────────────────────────────────────────────────────────────────────

export const readTools = {
  /**
   * Get practice profile information.
   */
  async getPractice(ctx: ToolContext): Promise<ToolResult> {
    try {
      const practice = await db.practice.findFirst({
        where: { tenantId: ctx.tenantId },
        include: {
          services: {
            where: { isActive: true },
            select: { name: true, description: true, duration: true, price: true },
            orderBy: { displayOrder: "asc" },
          },
        },
      });
      if (!practice) return { success: false, error: "Practice not found" };
      return { success: true, data: practice };
    } catch (e) {
      logger.error("tool.getPractice.error", { error: e as Error, tenantId: ctx.tenantId });
      return { success: false, error: "Failed to fetch practice" };
    }
  },

  /**
   * Get website overview and status.
   */
  async getWebsite(ctx: ToolContext): Promise<ToolResult> {
    try {
      const website = await db.website.findFirst({
        where: { tenantId: ctx.tenantId },
        include: {
          pages: {
            select: { id: true, title: true, slug: true, type: true, status: true, updatedAt: true },
            orderBy: { displayOrder: "asc" },
          },
        },
      });
      return { success: true, data: website };
    } catch (e) {
      return { success: false, error: "Failed to fetch website" };
    }
  },

  /**
   * Get all pages with their content status.
   */
  async getPages(ctx: ToolContext): Promise<ToolResult> {
    try {
      const pages = await db.page.findMany({
        where: { tenantId: ctx.tenantId },
        select: {
          id: true, title: true, slug: true, type: true, status: true,
          seoTitle: true, seoDescription: true, isIndexable: true,
          publishedAt: true, updatedAt: true,
        },
        orderBy: { displayOrder: "asc" },
      });
      return { success: true, data: pages };
    } catch (e) {
      return { success: false, error: "Failed to fetch pages" };
    }
  },

  /**
   * Get analytics summary for the practice website.
   */
  async getAnalyticsSummary(ctx: ToolContext): Promise<ToolResult> {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [totalVisitors, bookingStarts, bookingCompletions, inquiries] = await Promise.all([
        db.analyticsEvent.count({
          where: {
            tenantId: ctx.tenantId,
            type: "pageview",
            timestamp: { gte: sevenDaysAgo },
          },
        }),
        db.analyticsEvent.count({
          where: {
            tenantId: ctx.tenantId,
            type: "booking_start",
            timestamp: { gte: sevenDaysAgo },
          },
        }),
        db.analyticsEvent.count({
          where: {
            tenantId: ctx.tenantId,
            type: "booking_complete",
            timestamp: { gte: sevenDaysAgo },
          },
        }),
        db.inquiry.count({
          where: {
            tenantId: ctx.tenantId,
            createdAt: { gte: sevenDaysAgo },
          },
        }),
      ]);

      return {
        success: true,
        data: {
          period: "last_7_days",
          pageviews: totalVisitors,
          bookingStarts,
          bookingCompletions,
          conversionRate: totalVisitors > 0
            ? ((bookingCompletions / totalVisitors) * 100).toFixed(2) + "%"
            : "0%",
          newInquiries: inquiries,
        },
      };
    } catch (e) {
      return { success: false, error: "Failed to fetch analytics" };
    }
  },

  /**
   * Get recent bookings.
   */
  async getBookings(
    ctx: ToolContext,
    options: { limit?: number; status?: string } = {}
  ): Promise<ToolResult> {
    try {
      const bookings = await db.booking.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(options.status ? { status: options.status as never } : {}),
        },
        take: options.limit ?? 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, clientName: true, clientEmail: true,
          startTime: true, endTime: true, status: true,
          service: { select: { name: true } },
          createdAt: true,
        },
      });
      return { success: true, data: bookings };
    } catch (e) {
      return { success: false, error: "Failed to fetch bookings" };
    }
  },

  /**
   * Get recent inquiries.
   */
  async getInquiries(
    ctx: ToolContext,
    options: { limit?: number; status?: string } = {}
  ): Promise<ToolResult> {
    try {
      const inquiries = await db.inquiry.findMany({
        where: {
          tenantId: ctx.tenantId,
          ...(options.status ? { status: options.status as never } : {}),
        },
        take: options.limit ?? 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, email: true, subject: true,
          status: true, intent: true, createdAt: true,
        },
      });
      return { success: true, data: inquiries };
    } catch (e) {
      return { success: false, error: "Failed to fetch inquiries" };
    }
  },

  /**
   * Get website health: missing SEO, missing alt text, broken things.
   */
  async getSiteHealth(ctx: ToolContext): Promise<ToolResult> {
    try {
      const pages = await db.page.findMany({
        where: { tenantId: ctx.tenantId, status: "PUBLISHED" },
        select: {
          id: true, title: true, slug: true,
          seoTitle: true, seoDescription: true,
          content: true,
        },
      });

      const issues: Array<{ pageId: string; title: string; issue: string; severity: "error" | "warning" | "info" }> = [];

      for (const page of pages) {
        if (!page.seoTitle) {
          issues.push({ pageId: page.id, title: page.title, issue: "Missing SEO title", severity: "warning" });
        }
        if (!page.seoDescription) {
          issues.push({ pageId: page.id, title: page.title, issue: "Missing meta description", severity: "warning" });
        }
      }

      return {
        success: true,
        data: {
          totalPages: pages.length,
          issueCount: issues.length,
          issues,
          score: pages.length > 0
            ? Math.max(0, 100 - (issues.length / pages.length) * 10)
            : 100,
        },
      };
    } catch (e) {
      return { success: false, error: "Failed to analyze site health" };
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// WRITE TOOL STUBS (create AiAction records requiring approval)
// ─────────────────────────────────────────────────────────────────────────────

export const writeTools = {
  /**
   * Create a draft AI action for page update.
   * Returns action ID for the human approval flow.
   */
  async createUpdatePageAction(
    ctx: ToolContext,
    params: { pageId: string; proposedContent: unknown; reason: string }
  ): Promise<ToolResult<{ actionId: string }>> {
    try {
      const currentPage = await db.page.findFirst({
        where: { id: params.pageId, tenantId: ctx.tenantId },
        select: { content: true, title: true },
      });

      if (!currentPage) return { success: false, error: "Page not found" };

      const action = await db.aiAction.create({
        data: {
          tenantId: ctx.tenantId,
          practiceId: ctx.practiceId,
          userId: ctx.userId,
          type: "UPDATE_PAGE",
          status: "PLANNED",
          plan: {
            reason: params.reason,
            pageId: params.pageId,
          },
          preview: {
            before: currentPage.content,
            after: params.proposedContent as import("@prisma/client").Prisma.InputJsonValue,
          },
        },
      });

      return { success: true, data: { actionId: action.id } };
    } catch (e) {
      return { success: false, error: "Failed to create action" };
    }
  },

  /**
   * Create a draft AI action for creating a new page.
   */
  async createNewPageAction(
    ctx: ToolContext,
    params: { title: string; type: string; proposedContent: unknown; reason: string }
  ): Promise<ToolResult<{ actionId: string }>> {
    try {
      const action = await db.aiAction.create({
        data: {
          tenantId: ctx.tenantId,
          practiceId: ctx.practiceId,
          userId: ctx.userId,
          type: "CREATE_PAGE",
          status: "PLANNED",
          plan: {
            reason: params.reason,
            title: params.title,
            type: params.type,
          },
          preview: {
            proposedContent: params.proposedContent as import("@prisma/client").Prisma.InputJsonValue,
          },
        },
      });

      return { success: true, data: { actionId: action.id } };
    } catch (e) {
      return { success: false, error: "Failed to create action" };
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOOL DEFINITIONS FOR AI (JSON Schema format)
// ─────────────────────────────────────────────────────────────────────────────

export const AGENT_TOOL_DEFINITIONS = [
  {
    name: "getPractice",
    description: "Get the practice profile, name, type, services, and contact information",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    name: "getWebsite",
    description: "Get the website status, pages list, and publishing state",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    name: "getPages",
    description: "Get all website pages with their SEO and content status",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    name: "getAnalyticsSummary",
    description: "Get analytics summary: pageviews, bookings, conversion rate for the last 7 days",
    parameters: { type: "object", properties: {}, required: [] },
  },
  {
    name: "getBookings",
    description: "Get recent bookings",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max number of bookings (default 10)" },
        status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] },
      },
      required: [],
    },
  },
  {
    name: "getInquiries",
    description: "Get recent inquiries from potential clients",
    parameters: {
      type: "object",
      properties: {
        limit: { type: "number" },
        status: { type: "string", enum: ["NEW", "READ", "REPLIED", "ARCHIVED"] },
      },
      required: [],
    },
  },
  {
    name: "getSiteHealth",
    description: "Run a site health check to find SEO issues, missing metadata, accessibility problems",
    parameters: { type: "object", properties: {}, required: [] },
  },
];
