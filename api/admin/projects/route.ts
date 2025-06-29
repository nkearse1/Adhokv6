import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import { auth } from '@clerk/nextjs';

export async function GET(_req: NextRequest) {
  const { userId, sessionClaims } = auth();
  
  // Check if user is authenticated and has admin role
  if (!userId || sessionClaims?.metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await db.select().from(projects).limit(100);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching admin projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}