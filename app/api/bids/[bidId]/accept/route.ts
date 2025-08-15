import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { acceptBid, hasAcceptBidForProject, hasFeatureForClient } from '@/lib/server/bids';

type RouteContext = { params: Promise<{ bidId: string }> };

export async function POST(_req: NextRequest, ctx: RouteContext) {
  const { bidId } = await ctx.params;

  const clerkActive = !!process.env.CLERK_SECRET_KEY;
  let clientId: string | undefined;

  if (clerkActive) {
    const { auth } = await import('@clerk/nextjs/server');
    const authRes = await auth();
    clientId = authRes.userId ?? undefined;
  }

  if (clerkActive && !clientId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [hasFeature, canAccept] = await Promise.all([
    hasFeatureForClient(clientId!),
    hasAcceptBidForProject({ bidId, clientId: clientId! }),
  ]);

  if (!hasFeature || !canAccept) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await acceptBid({ bidId, clientId: clientId! });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/bids/[bidId]/accept] error', error);
    return NextResponse.json(
      { error: 'Failed to accept bid' },
      { status: 500 },
    );
  }
}
