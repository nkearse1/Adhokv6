import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { updateUser } from '@/lib/db/users';
import { getFullTalentProfile } from '@/lib/db/talentProfiles';
import { resolveUserId } from '@/lib/server/loadUserSession';

const bodySchema = z.object({
  fullName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paramId = searchParams.get('id');
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  let userId: string | undefined;
  if (clerkActive) {
    const { auth } = await import('@clerk/nextjs/server');
    userId = (await auth()).userId;
  }
  const id = paramId || userId || (await resolveUserId(req));
  if (!id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const profile = await getFullTalentProfile(id);
    if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Failed to fetch profile', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  let userId: string | undefined;
  if (clerkActive) {
    const { auth } = await import('@clerk/nextjs/server');
    userId = (await auth()).userId;
  }
  const id = userId || (await resolveUserId(req));
  if (!id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let data;
  try {
    data = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  try {
    const user = await updateUser(id, data);
    return NextResponse.json({ user });
  } catch (err) {
    console.error('Failed to update user', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
