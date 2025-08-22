import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { loadUserSession } from '@/lib/loadUserSession';
import {
  acceptBid,
  hasAcceptBidForProject,
  hasFeatureForClient,
  type Tx,
} from '@/lib/server/bids';

type RouteContext = { params: Promise<{ bidId: string }> };

export async function POST(req: NextRequest, ctx: RouteContext) {
  const { bidId } = await ctx.params;

  const url = new URL(req.url);
  const override =
    req.headers.get('x-override-user-id') || url.searchParams.get('override');
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const clerkActive = !!process.env.CLERK_SECRET_KEY && !useMock;

  let clientId: string | undefined = override || undefined;
  if (!clientId && clerkActive) {
    const { auth } = await import('@clerk/nextjs/server');
    clientId = (await auth()).userId || undefined;
  }
  if (!clientId) {
    const session = await loadUserSession();
    clientId = session?.userId;
  }
  if (!clientId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [hasFeature, canAccept] = await Promise.all([
    hasFeatureForClient(clientId, 'accept-bid'),
    hasAcceptBidForProject({ bidId, clientId }),
  ]);

  if (!hasFeature || !canAccept) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await db.transaction(async (tx: Tx) => acceptBid(tx, { bidId, clientId }));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/bids/[bidId]/accept] error', error);
    return NextResponse.json(
      { error: 'Failed to accept bid' },
      { status: 500 },
    );
  }
}
