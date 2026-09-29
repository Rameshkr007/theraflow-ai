import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
  website: z.string().max(0).optional() // Honeypot field for spam prevention
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // Spam check
    if (data.website && data.website.length > 0) {
      // Act like it succeeded to confuse bots
      return NextResponse.json({ success: true });
    }

    // Rate limit: 10 req/hour per IP logic here

    // Save as Inquiry in DB
    
    // Trigger notification to practice

    // Always return success to not reveal info to spammers
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true }); // Catch-all fake success
  }
}
