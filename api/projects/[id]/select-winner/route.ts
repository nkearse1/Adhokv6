import { NextRequest, NextResponse } from 'next/server';
import { selectProjectWinner } from '@/handlers/apiHandlers.projects';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { professionalId } = await req.json();
    const result = await selectProjectWinner(params.id, professionalId);
    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
