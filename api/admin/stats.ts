import { getAdminStats } from '@/lib/apiHandlers/admin';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function GET() {
  const { userId, sessionClaims } = auth();
  
  // Check if user is authenticated and has admin role
  if (!userId || sessionClaims?.metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
