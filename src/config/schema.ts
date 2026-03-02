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
  userEmail: varchar('userEmail'), //.references(() => usersTable.email).notNull()
  bannerImage: varchar("banner_image",{ length: 255 }).default(""),
});



export const chaptersContentTable = pgTable("chapters_content", {
  id: serial("id").primaryKey(),
  cid: varchar("cid").notNull(), // Links to coursesTable.cid (The UUID)
  chapterId: integer("chapter_id").notNull(), // The index of the chapter (0, 1, 2...)
  content: text("content").notNull(), // The long-form generated HTML/Markdown
  videoId: varchar("video_id"), // For later if you add YouTube integration
});