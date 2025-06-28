import { NextRequest, NextResponse } from 'next/server';
import { getProjectById } from '@/handlers/apiHandlers.projects';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await getProjectById(params.id);
    return NextResponse.json({ data: project });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
