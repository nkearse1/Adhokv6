import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  users,
  projects,
  talentProfiles,
  projectBids,
  projectReviews,
  escrowTransactions,
  notifications,
} from '@/lib/schema';

const tableMap = {
  users,
  projects,
  talent_profiles: talentProfiles,
  project_bids: projectBids,
  project_reviews: projectReviews,
  escrow_transactions: escrowTransactions,
  notifications,
} as const;
import { eq } from 'drizzle-orm';
export async function GET(request: NextRequest) {
  // Support optional mock user override via header or query param
  const userId =
    request.headers.get('x-user-override') ||
    new URL(request.url).searchParams.get('x-user-override') ||
    undefined;

  try {
    const url = new URL(request.url);
    const table = url.searchParams.get('table');
    const id = url.searchParams.get('id');

    if (!table) {
      return NextResponse.json({ error: 'Table parameter is required' }, { status: 400 });
    }

    const tableRef = tableMap[table as keyof typeof tableMap];
    if (!tableRef) {
      return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
    }

    if (!userId && table === 'projects') {
      console.warn('[api/db] no user override provided - returning example project data');
      return NextResponse.json({
        data: [
          {
            id: 'example-project',
            title: 'Example Project',
            description: 'Temporary project while user session resolves',
          },
        ],
      });
    }

    let data;
    if (id) {
      data = await db.select().from(tableRef).where(eq(tableRef.id, id));
    } else {
      data = await db.select().from(tableRef).limit(100);
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { table, data } = await request.json();
    
    if (!table || !data) {
      return NextResponse.json({ error: 'Table and data parameters are required' }, { status: 400 });
    }
    
    const tableRef = tableMap[table as keyof typeof tableMap];
    if (!tableRef) {
      return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
    }

    const result = await db.insert(tableRef).values(data).returning();
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Database insert error:', error);
    return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { table, id, data } = await request.json();
    
    if (!table || !id || !data) {
      return NextResponse.json({ error: 'Table, id, and data parameters are required' }, { status: 400 });
    }
    
    const tableRef = tableMap[table as keyof typeof tableMap];
    if (!tableRef) {
      return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
    }

    const result = await db.update(tableRef).set(data).where(eq(tableRef.id, id)).returning();
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const table = url.searchParams.get('table');
    const id = url.searchParams.get('id');
    
    if (!table || !id) {
      return NextResponse.json({ error: 'Table and id parameters are required' }, { status: 400 });
    }
    
    const tableRef = tableMap[table as keyof typeof tableMap];
    if (!tableRef) {
      return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
    }

    const result = await db.delete(tableRef).where(eq(tableRef.id, id)).returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Database delete error:', error);
    return NextResponse.json({ error: 'Database delete failed' }, { status: 500 });
  }
}
