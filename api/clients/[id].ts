import { getClientById } from '@/lib/apiHandlers/clients';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const client = await getClientById(params.id);
  return client
    ? NextResponse.json({ client })
    : NextResponse.json({ error: 'Client not found' }, { status: 404 });
}