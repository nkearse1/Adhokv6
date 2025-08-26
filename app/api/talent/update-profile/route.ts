import { updateTalentProfile } from '@/lib/db/talent';
import { loadUserSession } from '@/lib/loadUserSession';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  let userId: string | undefined;
  if (clerkActive) {
    const { auth } = await import('@clerk/nextjs/server');
    userId = (await auth()).userId || undefined;
  }
  if (!userId) {
    const session = await loadUserSession(req.headers);
    userId = session?.userId;
  }

  if (!userId) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  try {
    await updateTalentProfile(userId, body);
    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Failed to update profile:', err);
    return new Response('Error', { status: 500 });
  }
}
