import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Save onboarding step progress to DB
    // await db.tenant.update({ where: { id: tenantId }, data: { onboardingStep: body.step } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
