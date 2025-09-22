
import { createSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
  }

  try {
    await createSession(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json({ success: false, message: 'Failed to create session' }, { status: 500 });
  }
}
