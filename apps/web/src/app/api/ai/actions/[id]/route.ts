import { NextResponse } from 'next/server';
import { z } from 'zod';

const actionSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  rejectionReason: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { decision, rejectionReason } = actionSchema.parse(body);

    // Mock: update action status and execute if approved
    if (decision === 'approve') {
      // 1. Update status to APPROVED
      // 2. Execute action
      // 3. Update status to COMPLETED
      // 4. Audit log
      return NextResponse.json({ status: 'COMPLETED' });
    } else {
      // 1. Update status to REJECTED with reason
      // 2. Audit log
      return NextResponse.json({ status: 'REJECTED', reason: rejectionReason });
    }
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
