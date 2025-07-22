import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const { userId, sessionClaims } = isMock ? { userId: 'mock', sessionClaims: { metadata: { role: 'admin' } } } : await auth();

  // Cast to ensure TypeScript knows the shape of sessionClaims.metadata
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!isMock && (!userId || role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Admin access granted' });
}
