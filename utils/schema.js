import { serial, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core"; // PostgreSQL imports
import { pgTable } from "drizzle-orm/pg-core"; // Use PostgreSQL table

// Define the table schema
const MockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),
  jsonMockResp: text('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition', { length: 255 }).notNull(),
  jobDesc: varchar('jobDesc', { length: 500 }).notNull(),
  jobExperience: varchar('jobExperience', { length: 255 }).notNull(),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  mockId: varchar('mockId', { length: 255 }).notNull().unique(),
  createdByRole: varchar('createdByRole', { length: 50 }).notNull().default('user') // 'admin' or 'user'
});

// InterviewLink table for managing interview links
const InterviewLink = pgTable('interviewLink', {
  id: serial('id').primaryKey(),
  mockId: varchar('mockId', { length: 255 }).notNull().references(() => MockInterview.mockId),
  link: varchar('link', { length: 500 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  expiresAt: timestamp('expiresAt'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  createdBy: varchar('createdBy', { length: 255 }).notNull(), // name of the recruter 
  candidateEmail: varchar('candidateEmail', { length: 255 })
});

// TeamMember table for managing team members
const TeamMember = pgTable('teamMember', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }).notNull(),
  role: varchar('role', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  lastActive: timestamp('lastActive')
});

// InterviewAnalytics table for tracking interview statistics
const InterviewAnalytics = pgTable('interviewAnalytics', {
  id: serial('id').primaryKey(),
  mockId: varchar('mockId', { length: 255 }).notNull().references(() => MockInterview.mockId),
  totalInterviews: varchar('totalInterviews').notNull().default('0'),
  completedInterviews: varchar('completedInterviews').notNull().default('0'),
  pendingReviews: varchar('pendingReviews').notNull().default('0'),
  averageRating: varchar('averageRating', { length: 50 }),
  lastUpdated: timestamp('lastUpdated').defaultNow().notNull()
});

// Export all tables
export default MockInterview;
export {
  InterviewLink,
  TeamMember,
  InterviewAnalytics
};

export const UserAnswer = pgTable('userAnswer',{
  id: serial('id').primaryKey(),
  mockIdRef: varchar('mockId').notNull(),
  question: varchar('question').notNull(),
  correctAns: text('correctAns'),
  userAns: text('userAns'),
  feedback: text('feedback'),
  rating: varchar('rating'),
  userEmail: varchar('userEmail'),
  createdAt: varchar('createdAt'),
});

console.log("MockInterview table schema created successfully");
