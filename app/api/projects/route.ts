import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  const { userId, sessionClaims } = clerkActive ? await auth() : { userId: undefined, sessionClaims: undefined };

  // Cast to ensure TypeScript knows the shape of sessionClaims.metadata
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (clerkActive && (!userId || role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Admin access granted' });
}
