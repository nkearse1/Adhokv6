import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import env from '@/env.mjs';
import { db } from '@/lib/db';
import { clientProfiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getTierByStripePriceId } from '@/lib/billing/stripePlans';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

async function updateClientTier(options: {
  clientId?: string | null;
  priceId: string;
  expiresAt?: number | null;
}) {
  if (!options.clientId) return;
  const tier = await getTierByStripePriceId(options.priceId);
  await db
    .update(clientProfiles)
    .set({
      tierId: tier.id,
      tierExpiresAt: options.expiresAt
        ? new Date(options.expiresAt * 1000)
        : null,
    })
    .where(eq(clientProfiles.id, options.clientId));
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig || '',
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error('Stripe webhook verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0].price.id;
        await updateClientTier({
          clientId: subscription.metadata?.clientId,
          priceId,
          expiresAt: (subscription as any).current_period_end,
        });
        break;
      }
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (
          session.mode === 'subscription' &&
          typeof session.subscription === 'string'
        ) {
          const sub: any = await stripe.subscriptions.retrieve(
            session.subscription,
          );
          await updateClientTier({
            clientId: sub.metadata?.clientId,
            priceId: sub.items.data[0].price.id,
            expiresAt: sub.current_period_end,
          });
        } else if (session.metadata?.priceId) {
          await updateClientTier({
            clientId: session.metadata.clientId,
            priceId: session.metadata.priceId,
          });
        }
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error processing Stripe webhook', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
