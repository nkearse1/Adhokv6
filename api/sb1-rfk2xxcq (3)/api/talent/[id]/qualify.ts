import { NextRequest, NextResponse } from 'next/server';
import { qualifyTalent } from '@/lib/apiHandlers/talent';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { qualified } = await req.json();
  const data = await qualifyTalent(params.id, qualified);
  return NextResponse.json({ data });
}