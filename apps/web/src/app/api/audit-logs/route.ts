import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  apiUnauthorized,
  apiInternalError,
  parsePaginationParams,
  apiPaginated,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";

// GET /api/audit-logs - List immutable audit logs for tenant
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.tenantId) {
    return apiUnauthorized();
  }

  const { tenantId } = session.user;
  const { page, limit, skip } = parsePaginationParams(request.nextUrl.searchParams);
  const actionFilter = request.nextUrl.searchParams.get("action");
  const searchQuery = request.nextUrl.searchParams.get("q");

  try {
    const where: any = { tenantId };
    if (actionFilter && actionFilter !== "ALL") {
      where.action = actionFilter;
    }
    if (searchQuery) {
      where.OR = [
        { action: { contains: searchQuery, mode: "insensitive" } },
        { userEmail: { contains: searchQuery, mode: "insensitive" } },
        { resourceType: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.auditLog.count({ where }),
    ]);

    return apiPaginated(logs, { page, limit, total });
  } catch (error) {
    logger.error("api.audit_logs.list_error", { error: error as Error, tenantId });
    return apiInternalError("Failed to fetch audit log trail");
  }
}
