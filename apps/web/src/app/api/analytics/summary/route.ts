import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Authentication and tenant isolation happens in middleware
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || '30d';

  return NextResponse.json({
    period,
    isDemoData: true,
    data: {
      visitors: 12450,
      conversions: 720,
      avgSessionDuration: 165
    }
  });
}
