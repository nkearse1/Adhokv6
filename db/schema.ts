import {
  pgTable,
  text,
  uuid,
  timestamp,
  jsonb,
  integer
} from 'drizzle-orm/pg-core';

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

export const client_tiers = pgTable('client_tiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  monthly_price: integer('monthly_price').notNull().default(0),
  features: jsonb('features').notNull().default({}),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().references(() => users.id),
  tier_id: uuid('tier_id').references(() => client_tiers.id),
  tier_expires_at: timestamp('tier_expires_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey(),
});

