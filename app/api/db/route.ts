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
import { auth } from '@clerk/nextjs/server';
import type { SessionClaimsWithRole } from '@/lib/types';

export async function GET(request: NextRequest) {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const { userId } = isMock ? { userId: 'mock' } : await auth();
  
  // Check if user is authenticated
  if (!isMock && !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id');
    
    if (!table) {
      return NextResponse.json({ error: 'Table parameter is required' }, { status: 400 });
    }
    
    const tableRef = tableMap[table as keyof typeof tableMap];
    if (!tableRef) {
      return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
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
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const { userId } = isMock ? { userId: 'mock' } : await auth();
  
  // Check if user is authenticated
  if (!isMock && !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
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
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const { userId } = isMock ? { userId: 'mock' } : await auth();
  
  // Check if user is authenticated
  if (!isMock && !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
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
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  const { userId, sessionClaims } = isMock
    ? { userId: 'mock', sessionClaims: { metadata: { role: 'admin' } } }
    : await auth();
  const role = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
  
  // Check if user is authenticated and has admin role
  if (!isMock && (!userId || role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const id = searchParams.get('id');
    
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
