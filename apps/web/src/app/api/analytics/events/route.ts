import { NextResponse } from 'next/server';
import { z } from 'zod';

const eventSchema = z.object({
  type: z.enum([
     'pageview', 'cta_click', 'booking_start', 'booking_complete',
     'form_start', 'form_abandon', 'form_complete', 'scroll_depth',
     'outbound_link', 'phone_click', 'email_click'
  ]),
  page: z.string().optional(),
  referrer: z.string().optional(),
  properties: z.record(z.unknown()).optional(),
  sessionId: z.string().optional(),
  visitorId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ status: 'ignored', reason: 'invalid_schema' }, { status: 200 });
    }

    // Rate limit check, tenant analytics enabled check, anonymization would happen here
    
    return NextResponse.json({ status: 'recorded' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}
