import { pgTable, serial, text, timestamp, uuid, boolean, jsonb, integer } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  userRole: text('user_role').notNull().default('talent'),
  companyId: uuid('company_id').references(() => companies.id),
  trustScore: integer('trust_score'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Companies table
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  website: text('website'),
  industry: text('industry'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Talent profiles table
export const talentProfiles = pgTable('talent_profiles', {
  id: uuid('id').primaryKey().references(() => users.id),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  username: text('username').unique(),
  phone: text('phone'),
  location: text('location'),
  linkedin: text('linkedin'),
  portfolio: text('portfolio'),
  bio: text('bio'),
  expertise: text('expertise').notNull(),
  resumeUrl: text('resume_url'),
  isQualified: boolean('is_qualified').default(false),
  qualificationReason: text('qualification_reason'),
  qualificationHistory: jsonb('qualification_history'),
  experienceBadge: text('experience_badge'),
  portfolioVisible: boolean('portfolio_visible').default(true),
  trustScore: integer('trust_score'),
  trustScoreUpdatedAt: timestamp('trust_score_updated_at'),
  trustScoreFactors: jsonb('trust_score_factors'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export type TalentProfile = typeof talentProfiles.$inferSelect;

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('draft'),
  category: text('category'),
  deadline: timestamp('deadline'),
  projectBudget: integer('project_budget'),
  estimatedHours: integer('estimated_hours'),
  hourlyRate: integer('hourly_rate'),
  minimumBadge: text('minimum_badge'),
  flagged: boolean('flagged').default(false),
  clientId: uuid('client_id').references(() => users.id),
  talentId: uuid('talent_id').references(() => users.id),
  createdBy: uuid('created_by').references(() => users.id),
  requestingUser: uuid('requesting_user').references(() => users.id),
  requestingBusiness: uuid('requesting_business').references(() => companies.id),
  matchedTalent: text('matched_talent'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Project bids table
export const projectBids = pgTable('project_bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  professionalId: uuid('professional_id').references(() => users.id).notNull(),
  ratePerHour: integer('rate_per_hour').notNull(),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Project deliverables table
export const projectDeliverables = pgTable('project_deliverables', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('recommended'),
  notes: text('notes'),
  feedback: text('feedback'),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Project reviews table
export const projectReviews = pgTable('project_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  reviewerId: uuid('reviewer_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  addToPortfolio: boolean('add_to_portfolio').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  isRead: boolean('is_read').default(false),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow()
});

// Activity logs table
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id),
  actorId: uuid('actor_id').references(() => users.id),
  action: text('action').notNull(),
  details: jsonb('details').default({}),
  createdAt: timestamp('created_at').defaultNow()
});

// Admin users table
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().references(() => users.id),
  email: text('email').notNull(),
  superAdmin: boolean('super_admin').default(false),
  username: text('username').unique(),
  createdAt: timestamp('created_at').defaultNow()
});

// Escrow transactions table
export const escrowTransactions = pgTable('escrow_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  status: text('status').notNull().default('pending'),
  amount: integer('amount').notNull(),
  releasedAt: timestamp('released_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Escrow history table
export const escrowHistory = pgTable('escrow_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  action: text('action').notNull(),
  actorId: uuid('actor_id').references(() => users.id),
  actorName: text('actor_name'),
  reason: text('reason'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow()
});

// Project messages table
export const projectMessages = pgTable('project_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  senderRole: text('sender_role').notNull(),
  text: text('text').notNull(),
  deliverableId: uuid('deliverable_id').references(() => projectDeliverables.id),
  createdAt: timestamp('created_at').defaultNow()
});

// Waitlist table
export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  signedUpAt: timestamp('signed_up_at').defaultNow()
});

export const clientTiers = pgTable('client_tiers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
export type ClientTier = typeof clientTiers.$inferSelect;

export const clientProfiles = pgTable('client_profiles', {
  id: uuid('id').primaryKey(),
  email: text('email'),
  companyName: text('company_name'),
  tierId: integer('tier_id').references(() => clientTiers.id),
  tierExpiresAt: timestamp('tier_expires_at'),
});

