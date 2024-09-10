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

console.log("MockInterview table schema created successfully");
