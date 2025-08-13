import { pgTable, text, uuid, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

export const FEATURE_FLAGS = ['accept_bid'] as const;
export type FeatureFlag = typeof FEATURE_FLAGS[number];

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

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  website: text('website'),
  industry: text('industry'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at')
});

export const client_tiers = pgTable('client_tiers', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  monthly_price: integer('monthly_price').notNull(),
  features: text('features').array().$type<FeatureFlag[]>(),
  created_at: timestamp('created_at').defaultNow()
});

export const client_profiles = pgTable('client_profiles', {
  id: uuid('id').primaryKey(),
  email: text('email'),
  company_name: text('company_name'),
  tier_id: uuid('tier_id').references(() => client_tiers.id),
  tier_expires_at: timestamp('tier_expires_at')
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('draft'),
  category: text('category'),
  deadline: timestamp('deadline'),
  project_budget: integer('project_budget'),
  estimated_hours: integer('estimated_hours'),
  hourly_rate: integer('hourly_rate'),
  minimum_badge: text('minimum_badge'),
  flagged: boolean('flagged').default(false),
  accept_bid_enabled: boolean('accept_bid_enabled').default(false),
  client_id: uuid('client_id').references(() => users.id),
  talent_id: uuid('talent_id').references(() => users.id),
  created_by: uuid('created_by').references(() => users.id),
  requesting_user: uuid('requesting_user').references(() => users.id),
  requesting_business: uuid('requesting_business').references(() => companies.id),
  matched_talent: text('matched_talent'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at')
});

export type ClientTier = typeof client_tiers.$inferSelect;
export type Client = typeof client_profiles.$inferSelect;
export type Project = typeof projects.$inferSelect;
