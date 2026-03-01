import { boolean, integer, json, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar(),
});


export const couresesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  numberOfModules: integer().notNull(),
  includeVideo: boolean().default(false),
  difficultyLevel: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  courseJson: json(),
  userEmail: varchar('userEmail').references(() => usersTable.email).notNull(),
  bannerImage: varchar("banner_image",{ length: 255 }),
});