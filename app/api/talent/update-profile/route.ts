import { auth } from '@clerk/nextjs/server';
import { updateTalentProfile } from '@/lib/db/talent';
import { resolveUserId } from '@/lib/server/loadUserSession';

export async function POST(req: Request) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  const { userId } = clerkActive ? await auth() : { userId: undefined };
  const idToUse = userId || (await resolveUserId());

  if (!idToUse) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  try {
    await updateTalentProfile(idToUse, body);
    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Failed to update profile:', err);
    return new Response('Error', { status: 500 });
  }
}
