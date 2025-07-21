import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getMockUser, type MockRole } from '@/server/getMockUser';

export async function GET(req: NextRequest) {
  const role = (new URL(req.url).searchParams.get('role') as MockRole) || 'talent';
  const user = await getMockUser(role);
  return NextResponse.json({ user });
}
