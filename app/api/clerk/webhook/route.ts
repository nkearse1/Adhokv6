import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Webhook } from 'svix';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, talentProfiles, clientProfiles } from '@/lib/schema';

interface ClerkWebhookEvent {
  type: string;
  data: any;
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  try {
    const headerList = request.headers;
    const headers = {
      'svix-id': headerList.get('svix-id') || '',
      'svix-timestamp': headerList.get('svix-timestamp') || '',
      'svix-signature': headerList.get('svix-signature') || '',
    };
    const evt = wh.verify(payload, headers) as ClerkWebhookEvent;
    console.log('Clerk webhook event', evt.type);

    if (evt.type === 'user.created') {
      const {
        id,
        email_addresses,
        username,
        first_name,
        last_name,
        public_metadata,
        primary_email_address_id,
      } = evt.data;

      const emailEntry = email_addresses.find((e: any) => e.id === primary_email_address_id);
      const email = emailEntry?.email_address;

      const fullName = `${first_name || ''} ${last_name || ''}`.trim();
      const role = (public_metadata?.role as string) || 'talent';

      if (id && email) {
        // Ensure the Clerk user has the role stored in public metadata
        await clerkClient.users.updateUser(id, {
          publicMetadata: { role },
        });

        // Insert into users table
        await db.insert(users).values({
          id,
          fullName,
          email,
          username: username || id,
          userRole: role,
        });

        // Insert into matching profile table
        if (role === 'client') {
          await db.insert(clientProfiles).values({
            id,
            email,
            companyName: '', // placeholder – you can allow the user to fill this in later
          });
        } else {
          await db.insert(talentProfiles).values({
            id,
            email,
            fullName,
            expertise: '', // placeholder
            experienceBadge: 'Specialist', // default
            isQualified: false,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}
