import { auth } from '@clerk/nextjs';
import { updateTalentProfile } from '@/lib/db/talent';

export async function POST(req: Request) {
  const { userId } = auth();
  const overrideId = process.env.NEXT_PUBLIC_SELECTED_USER_ID;
  const idToUse = userId || overrideId;

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
