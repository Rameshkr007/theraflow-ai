import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Auth check & Get booking details
  return NextResponse.json({ id: params.id, status: 'CONFIRMED' });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // Update status, notes
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // Soft delete / cancel
  return NextResponse.json({ success: true, status: 'CANCELLED' });
}
