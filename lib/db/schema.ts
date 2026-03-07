import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email'),
  full_name: text('full_name'),
  username: text('username'),
  user_role: text('user_role').notNull(),
  role: text('role'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at')
});
