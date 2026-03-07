import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { updateUser } from '@/lib/db/users';
import { getFullTalentProfile } from '@/lib/db/talentProfiles';
import { loadUserSession } from '@/lib/loadUserSession';

const bodySchema = z.object({
  fullName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
});

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const paramId = url.searchParams.get('id');
  const override =
    req.headers.get('x-override-user-id') || url.searchParams.get('override');
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const clerkActive = !!process.env.CLERK_SECRET_KEY && !useMock;

  let userId: string | undefined = override || undefined;
  if (!userId && clerkActive) {
    const { auth } = await import('@clerk/nextjs/server');
    userId = (await auth()).userId || undefined;
  }
  if (!userId) {
    const session = await loadUserSession(req.headers);
    userId = session?.userId;
  }
  const id = paramId || userId;
  if (!id) {
    return NextResponse.json({ error: 'No id provided' }, { status: 400 });
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
  const url = req.nextUrl;
  const override =
    req.headers.get('x-override-user-id') || url.searchParams.get('override');
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const clerkActive = !!process.env.CLERK_SECRET_KEY && !useMock;

  let userId: string | undefined = override || undefined;
  if (!userId && clerkActive) {
    const { auth } = await import('@clerk/nextjs/server');
    userId = (await auth()).userId || undefined;
  }
  if (!userId) {
    const session = await loadUserSession(req.headers);
    userId = session?.userId;
  }
  if (!userId) {
    return NextResponse.json({ error: 'No id provided' }, { status: 400 });
  }
  let data;
  try {
    data = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  try {
    const user = await updateUser(userId, data);
    return NextResponse.json({ user });
  } catch (err) {
    console.error('Failed to update user', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
