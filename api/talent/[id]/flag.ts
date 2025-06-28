import { NextRequest, NextResponse } from 'next/server';
import { flagTalent } from '@/lib/apiHandlers/talent';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { reason } = await req.json();
  const data = await flagTalent(params.id, reason);
  return NextResponse.json({ data });