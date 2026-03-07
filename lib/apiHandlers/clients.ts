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
  console.log('[getClientProjects] querying projects for client', id);
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.clientId, id));
  if (result.length === 0) {
    console.warn('[getClientProjects] no projects found for client', id);
  } else {
    console.log('[getClientProjects] retrieved', result.length, 'projects');
  }
  return result;
}
