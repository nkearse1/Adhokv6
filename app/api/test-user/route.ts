import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { type TestRole } from '@/server/getTestUser';
import { selectUserByRole } from '@/server/selectUserByRole';

export async function GET(req: NextRequest) {
  const role = (new URL(req.url).searchParams.get('role') as TestRole) || 'talent';
  const user = await selectUserByRole(role);
  return NextResponse.json({ user });
}
