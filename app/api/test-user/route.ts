import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getTestUser, type TestRole } from '@/server/getTestUser';

export async function GET(req: NextRequest) {
  const role = (new URL(req.url).searchParams.get('role') as TestRole) || 'talent';
  const user = await getTestUser(role);
  return NextResponse.json({ user });
}
