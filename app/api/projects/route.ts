import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  const { userId, sessionClaims } = auth();

  // Cast to ensure TypeScript knows the shape of sessionClaims.metadata
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Admin access granted' });
}
