import { serial, text, varchar, timestamp } from "drizzle-orm/pg-core"; // PostgreSQL imports
import { pgTable } from "drizzle-orm/pg-core"; // Use PostgreSQL table

// Define the table schema
const MockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),
  jsonMockResp: text('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition', { length: 255 }).notNull(),
  jobDesc: varchar('jobDesc', { length: 500 }).notNull(),
  jobExperience: varchar('jobExperience', { length: 255 }).notNull(),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(), // Use timestamp instead
  mockId: varchar('mockId', { length: 255 }).notNull()
});

// Export the table schema
export default MockInterview;


export const UserAnswer = pgTable('userAnswer',{
  id:serial('id').primaryKey(),
  mockIdRef:varchar('mockId').notNull(),
  question:varchar('question').notNull(),
  correctAns:text('correctAns'),
  userAns:text('userAns'),
  feedback:text('feedback'),
  rating:varchar('rating'),
  userEmail:varchar('userEmail'),
  createdAt:varchar('createdAt'),
})

console.log("MockInterview table schema created successfully");
