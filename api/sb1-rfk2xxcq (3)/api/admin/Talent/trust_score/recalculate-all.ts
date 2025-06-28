import { recalculateAllTrustScores } from '@/lib/apiHandlers/admin';
import { NextResponse } from 'next/server';

export async function POST() {
  const result = await recalculateAllTrustScores();
  return NextResponse.json(result);
}