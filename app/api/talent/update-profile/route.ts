import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { updateTalentProfile } from '@/lib/db/talentProfiles';
import { z } from 'zod';

const bodySchema = z.object({
  fullName: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
  experienceLevel: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
});

const isMock = process.env.USE_MOCK_SESSION === 'true';
let mockProfile: any = null;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let data;
  try {
    const json = await req.json();
    data = bodySchema.parse(json);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    if (isMock) {
      mockProfile = { id: userId, ...data };
      return NextResponse.json({ profile: mockProfile });
    }

    const profile = await updateTalentProfile(userId, {
      fullName: data.fullName,
      username: data.username,
      bio: data.bio,
      expertise: data.skills,
      experienceBadge: data.experienceLevel,
      portfolio: data.portfolioUrl,
    });
    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Failed to update profile', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
