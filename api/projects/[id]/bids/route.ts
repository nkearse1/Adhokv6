import { NextRequest, NextResponse } from 'next/server';
import { getProjectBids } from '@/handlers/apiHandlers.projects';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bids = await getProjectBids(params.id);
    return NextResponse.json({ data: bids });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
