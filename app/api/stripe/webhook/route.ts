import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { getTierForPrice } from '@/lib/billing/stripePlans';

function verifySignature(payload: string, header: string, secret: string): boolean {
  const elements = Object.fromEntries(
    header.split(',').map((p) => {
      const [k, v] = p.split('=');
      return [k, v];
    }),
  );
  const timestamp = elements['t'];
  const signature = elements['v1'];
  if (!timestamp || !signature) return false;
  const signedPayload = `${timestamp}.${payload}`;
  const expected = createHmac('sha256', secret).update(signedPayload).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function updateClientTier(clientId: string, tierId: string, expiresAt?: number) {
  const expiry = expiresAt ? new Date(expiresAt * 1000).toISOString() : null;
  await db.execute(sql`
    update clients set tier_id = ${tierId}, tier_expires_at = ${expiry} where id = ${clientId}
  `);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';
  const secret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!verifySignature(body, sig, secret)) {
    console.error('Invalid Stripe signature');
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(body);

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const priceId = sub?.items?.data?.[0]?.price?.id as string | undefined;
        const tierId = getTierForPrice(priceId || null);
        const clientId = sub?.metadata?.clientId || sub?.metadata?.userId || sub?.customer;
        const expiresAt = sub?.current_period_end as number | undefined;
        if (tierId && clientId) {
          await updateClientTier(clientId, tierId, expiresAt);
        }
        break;
      }
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscriptionId = session.subscription as string | undefined;
        const clientId = session?.metadata?.clientId || session?.client_reference_id;
        if (subscriptionId && clientId) {
          const res = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
            headers: {
              Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            },
          });
          if (res.ok) {
            const sub = await res.json();
            const priceId = sub?.items?.data?.[0]?.price?.id as string | undefined;
            const tierId = getTierForPrice(priceId || null);
            const expiresAt = sub?.current_period_end as number | undefined;
            if (tierId) {
              await updateClientTier(clientId, tierId, expiresAt);
            }
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook handler failed', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
