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

// Simple candidate session tracking (minimal addition)
export const CandidateSession = pgTable('candidateSession', {
  id: serial('id').primaryKey(),
  mockId: varchar('mockId', { length: 255 }).notNull().references(() => MockInterview.mockId),
  candidateEmail: varchar('candidateEmail', { length: 255 }).notNull(),
  candidateName: varchar('candidateName', { length: 255 }),
  uniqueToken: varchar('uniqueToken', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, completed
  completedAt: timestamp('completedAt'),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// Custom Application Forms
export const ApplicationForm = pgTable('applicationForm', {
  id: serial('id').primaryKey(),
  formId: varchar('formId', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  fields: text('fields').notNull(), // JSON string of form fields
  isActive: boolean('isActive').notNull().default(true),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

// Form Field Definitions (for reference)
export const FormField = pgTable('formField', {
  id: serial('id').primaryKey(),
  formId: varchar('formId', { length: 255 }).notNull().references(() => ApplicationForm.formId),
  fieldId: varchar('fieldId', { length: 255 }).notNull(),
  fieldType: varchar('fieldType', { length: 50 }).notNull(), // text, email, phone, select, textarea, file, etc.
  label: varchar('label', { length: 255 }).notNull(),
  placeholder: varchar('placeholder', { length: 255 }),
  required: boolean('required').notNull().default(false),
  options: text('options'), // JSON for select/radio options
  validation: text('validation'), // JSON for validation rules
  order: varchar('order', { length: 10 }).notNull().default('0'),
  createdAt: timestamp('createdAt').defaultNow().notNull()
});

// User Applications/Submissions
export const UserApplications = pgTable('userApplications', {
  id: serial('id').primaryKey(),
  formId: varchar('formId', { length: 255 }).notNull().references(() => ApplicationForm.formId),
  applicantName: varchar('applicantName', { length: 255 }).notNull(),
  applicantEmail: varchar('applicantEmail', { length: 255 }).notNull(),
  applicationData: text('applicationData').notNull(), // JSON string of form responses
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, reviewed, accepted, rejected
  submittedAt: timestamp('submittedAt').defaultNow().notNull(),
  reviewedAt: timestamp('reviewedAt'),
  reviewedBy: varchar('reviewedBy', { length: 255 }),
  notes: text('notes')
});

console.log("MockInterview table schema created successfully");
