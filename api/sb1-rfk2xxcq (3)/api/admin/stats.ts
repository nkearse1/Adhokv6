import { getAdminStats } from '@/lib/apiHandlers/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  const stats = await getAdminStats();
  return NextResponse.json(stats);
}