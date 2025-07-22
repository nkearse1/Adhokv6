import { auth } from '@clerk/nextjs/server';
import { updateTalentProfile } from '@/lib/db/talent';
import { resolveUserId } from '@/lib/server/loadUserSession';

export async function POST(req: Request) {
  const { userId } = await auth().catch(() => ({ userId: undefined }));
  const idToUse = userId || resolveUserId();

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
