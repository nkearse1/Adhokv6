import { getClientById } from '@/lib/apiHandlers/clients';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { userId, sessionClaims } = auth();
  
  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin or the client themselves
  const isAdmin = sessionClaims?.metadata?.role === 'admin';
  const isOwnProfile = userId === params.id;
  
  if (!isAdmin && !isOwnProfile) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const client = await getClientById(params.id);
    return client
      ? NextResponse.json({ client })
      : NextResponse.json({ error: 'Client not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}