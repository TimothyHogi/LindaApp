import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  chatMessages, 
  InsertChatMessage,
  reports,
  InsertReport,
  lessons,
  learningProgress,
  InsertLearningProgress,
  privacyTips,
  stories,
  InsertStory,
  helpCenters,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.preferredLanguage !== undefined) {
      values.preferredLanguage = user.preferredLanguage;
      updateSet.preferredLanguage = user.preferredLanguage;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Chat Messages
export async function getChatHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatMessages).where(eq(chatMessages.userId, userId)).orderBy(chatMessages.createdAt);
}

export async function addChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(chatMessages).values(message);
}

// Reports
export async function createReport(report: InsertReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(reports).values(report);
  return result;
}

export async function getAllReports() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reports).orderBy(desc(reports.createdAt));
}

export async function getUserReports(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt));
}

// Lessons
export async function getAllLessons() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lessons).orderBy(lessons.orderIndex);
}

export async function getLessonById(lessonId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Learning Progress
export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(learningProgress).where(eq(learningProgress.userId, userId));
}

export async function markLessonComplete(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(learningProgress)
    .where(and(eq(learningProgress.userId, userId), eq(learningProgress.lessonId, lessonId)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(learningProgress)
      .set({ completed: true, completedAt: new Date() })
      .where(eq(learningProgress.id, existing[0].id));
  } else {
    await db.insert(learningProgress).values({
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    });
  }
}

// Privacy Tips
export async function getAllPrivacyTips() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(privacyTips).orderBy(privacyTips.orderIndex);
}

// Stories
export async function getAllStories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories).orderBy(desc(stories.createdAt));
}

export async function createStory(story: InsertStory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(stories).values(story);
}

export async function updateStoryReactions(storyId: number, reactions: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(stories).set({ reactions }).where(eq(stories.id, storyId));
}

// Help Centers
export async function getAllHelpCenters() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(helpCenters);
}

export async function updateUserLanguage(userId: number, language: "en" | "sw") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ preferredLanguage: language }).where(eq(users.id, userId));
}
