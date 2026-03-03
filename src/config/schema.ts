import { boolean, integer, json, pgTable, text, varchar,serial } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscriptionId: varchar(),
});


export const coursesTable = pgTable("courses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  numberOfModules: integer().notNull(),
  includeVideo: boolean().default(false),
  difficultyLevel: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  courseJson: json(),
  userEmail: varchar('userEmail'), // The CREATOR of the course
  bannerImage: varchar("banner_image",{ length: 255 }).default(""),
  status: varchar('status').default('pending')
});



export const chaptersContentTable = pgTable("chapters_content", {
  id: serial("id").primaryKey(),
  cid: varchar("cid").notNull(),
  chapterId: integer("chapter_id").notNull(),
  content: text("content").notNull(),
  videoId: varchar("video_id"),
});


export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userEmail: varchar("userEmail").notNull(),
  courseCid: varchar("courseCid").notNull(),
});

export const chapterProgressTable = pgTable("chapter_progress", {
  id: serial("id").primaryKey(),
  userEmail: varchar("userEmail").notNull(),
  chapterId: integer("chapter_id").notNull(), // Links to chaptersContentTable.chapterId
  courseCid: varchar("courseCid").notNull(),
  isCompleted: boolean('isCompleted').default(false).notNull(),
});