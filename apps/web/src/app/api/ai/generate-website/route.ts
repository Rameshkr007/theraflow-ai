import { NextResponse } from 'next/server';
import { WebsiteGenerator } from '@/lib/ai/website-generator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const generator = new WebsiteGenerator();
    
    const website = await generator.generateWebsite(body);

    // Save to DB (mocked)
    // await db.website.create({ data: { tenantId, structure: website } });

    return NextResponse.json({ success: true, website });
  } catch (error) {
    console.error('Error generating website:', error);
    return NextResponse.json({ error: 'Failed to generate website' }, { status: 500 });
  }
}
