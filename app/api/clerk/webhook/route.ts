import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
  try {
    const evt = wh.verify(payload, req.headers as any);
    console.log('Clerk webhook event', evt.type);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
} 