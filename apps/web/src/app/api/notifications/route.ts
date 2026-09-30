import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  apiSuccess,
  apiUnauthorized,
  apiInternalError,
  parsePaginationParams,
  apiPaginated,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";

// GET /api/notifications - List user notifications
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);
  const unreadOnly = request.nextUrl.searchParams.get("unread") === "true";

  try {
    const where: any = { tenantId, userId };
    if (unreadOnly) {
      where.status = { not: "READ" };
    }

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.notification.count({ where }),
      db.notification.count({
        where: { tenantId, userId, status: { not: "READ" } },
      }),
    ]);

    const res = apiPaginated(notifications, { page, limit, total });
    // Attach unread count in meta
    return apiSuccess({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    logger.error("api.notifications.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch notifications");
  }
}

// PATCH /api/notifications - Mark all as read
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId, id: userId } = session.user;

  try {
    await db.notification.updateMany({
      where: {
        tenantId,
        userId,
        status: { not: "READ" },
      },
      data: {
        status: "READ",
        readAt: new Date(),
      },
    });

    return apiSuccess({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    logger.error("api.notifications.patch_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to mark notifications as read");
  }
}
