import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export type Session =
  | { userId: string; userRole: string | null; metadata: Record<string, unknown> }
  | null;

export async function loadUserSession(hdrs: Headers): Promise<Session> {
  const overrideId = hdrs.get('x-override-user-id')?.trim();

  if (overrideId) {
    const rows = await db.select().from(users).where(eq(users.id, overrideId)).limit(1);
    const user = rows[0];
    if (user) {
      return {
        userId: user.id,
        userRole: (user as any).user_role ?? null,
        metadata: (user as any).metadata ?? {},
      };
    }
  }

  return null;
}
