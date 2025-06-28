import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
  try {
    const evt = wh.verify(payload, req.headers as any);
    console.log('Clerk webhook event', evt.type);
    
    // Handle user creation
    if (evt.type === 'user.created') {
      const { id, email_addresses, username, first_name, last_name, public_metadata } = evt.data;
      
      // Get the primary email
      const primaryEmail = email_addresses.find((email: any) => email.id === evt.data.primary_email_address_id);
      
      if (id && primaryEmail) {
        // Insert the user into our database
        await db.insert(users).values({
          id,
          fullName: `${first_name || ''} ${last_name || ''}`.trim(),
          email: primaryEmail.email_address,
          username: username || id,
          userRole: (public_metadata?.role as string) || 'talent'
        });
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}