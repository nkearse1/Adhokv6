import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users, projects } from '@/lib/schema';

export async function getClientById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getClientProjects(id: string) {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.client_id, id));
  return result;
}
