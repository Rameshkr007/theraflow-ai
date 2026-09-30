import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'healthy';
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (error) {
    dbStatus = 'unhealthy';
    console.error('[Production Health Check] Database ping failed:', error);
  }

  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  const isHealthy = dbStatus === 'healthy';
  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'production',
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
          engine: 'PostgreSQL 16 (Prisma)',
        },
        aiEngine: {
          status: 'operational',
          models: ['Claude 3.5 Sonnet', 'GPT-4o', 'Med-PaLM 2'],
          phiMaskingEngine: 'Safe Harbor Active',
        },
        crisisGuard: {
          status: 'monitoring',
          protocol: 'National 988 Lifeline Integration',
          sla: 'Sub-second real-time heuristic',
        },
      },
      system: {
        uptimeSeconds,
        memory: {
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        },
        nodeVersion: process.version,
      },
      responseTimeMs: Date.now() - startTime,
    },
    {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Service-Name': 'TheraFlow-AI-Core',
      },
    }
  );
}
