import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  preferredLanguage: mysqlEnum("preferredLanguage", ["en", "sw"]).default("en").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Chat history for AI Chat Assistant
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  language: mysqlEnum("language", ["en", "sw"]).notNull(),
  audioUrl: text("audioUrl"), // Optional voice message URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Abuse reports
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Nullable for anonymous reports
  abuseType: varchar("abuseType", { length: 100 }).notNull(),
  description: text("description").notNull(),
  audioUrl: text("audioUrl"), // Optional audio description
  photoUrl: text("photoUrl"), // Optional photo evidence
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  status: mysqlEnum("status", ["pending", "reviewed", "resolved"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Learning lessons
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 200 }).notNull(),
  titleSw: varchar("titleSw", { length: 200 }).notNull(),
  contentEn: text("contentEn").notNull(),
  contentSw: text("contentSw").notNull(),
  illustrationUrl: text("illustrationUrl"),
  audioUrlEn: text("audioUrlEn"),
  audioUrlSw: text("audioUrlSw"),
  videoUrl: text("videoUrl"),
  orderIndex: int("orderIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * User progress in learning corner
 */
export const learningProgress = mysqlTable("learningProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LearningProgress = typeof learningProgress.$inferSelect;
export type InsertLearningProgress = typeof learningProgress.$inferInsert;

/**
 * Privacy tips
 */
export const privacyTips = mysqlTable("privacyTips", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("titleEn", { length: 200 }).notNull(),
  titleSw: varchar("titleSw", { length: 200 }).notNull(),
  contentEn: text("contentEn").notNull(),
  contentSw: text("contentSw").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(), // Emoji or icon name
  orderIndex: int("orderIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PrivacyTip = typeof privacyTips.$inferSelect;
export type InsertPrivacyTip = typeof privacyTips.$inferInsert;

/**
 * Community stories
 */
export const stories = mysqlTable("stories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Nullable for anonymous stories
  content: text("content").notNull(),
  audioUrl: text("audioUrl"), // Optional audio story
  language: mysqlEnum("language", ["en", "sw"]).notNull(),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  reactions: text("reactions"), // JSON string of emoji reactions count
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;

/**
 * Help centers (NGOs, shelters, support centers)
 */
export const helpCenters = mysqlTable("helpCenters", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 200 }).notNull(),
  nameSw: varchar("nameSw", { length: 200 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionSw: text("descriptionSw"),
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  website: text("website"),
  type: mysqlEnum("type", ["ngo", "shelter", "support_center", "hotline"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HelpCenter = typeof helpCenters.$inferSelect;
export type InsertHelpCenter = typeof helpCenters.$inferInsert;
