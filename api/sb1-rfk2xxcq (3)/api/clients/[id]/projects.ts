import { getClientProjects } from '@/lib/apiHandlers/clients';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const projects = await getClientProjects(params.id);
  return NextResponse.json({ projects });
}