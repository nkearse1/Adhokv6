import { NextResponse } from 'next/server';
import { updateTalentTrustScore } from '@/lib/apiHandlers/talent';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const data = await updateTalentTrustScore(params.id);
  return NextResponse.json({ data });
}