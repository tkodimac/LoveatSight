import { and, desc, eq, gt, ne, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, Match, knockNotifications, matches, messages, subscriptions, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
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
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
}

// Nearby users: returns users within ~50km (rough lat/lon bounding box)
export async function getNearbyUsers(userId: number, lat: number, lon: number, radiusKm = 50) {
  const db = await getDb();
  if (!db) return [];
  const latDelta = radiusKm / 111.0;
  const lonDelta = radiusKm / (111.0 * Math.cos((lat * Math.PI) / 180));
  const result = await db
    .select()
    .from(users)
    .where(
      and(
        ne(users.id, userId),
        sql`${users.latitude} BETWEEN ${lat - latDelta} AND ${lat + latDelta}`,
        sql`${users.longitude} BETWEEN ${lon - lonDelta} AND ${lon + lonDelta}`,
        eq(users.ageVerified, true),
      )
    )
    .limit(20);
  return result;
}

export function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getOrCreateMatch(userId1: number, userId2: number) {
  const db = await getDb();
  if (!db) return null;
  const [u1, u2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
  const existing = await db
    .select()
    .from(matches)
    .where(and(eq(matches.userId1, u1), eq(matches.userId2, u2)))
    .limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(matches).values({ userId1: u1, userId2: u2, status: "knocked" });
  const created = await db
    .select()
    .from(matches)
    .where(and(eq(matches.userId1, u1), eq(matches.userId2, u2)))
    .limit(1);
  return created.length > 0 ? created[0] : null;
}

export async function getMatchById(matchId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserMatches(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(matches)
    .where(or(eq(matches.userId1, userId), eq(matches.userId2, userId)))
    .orderBy(desc(matches.updatedAt));
}

export async function updateMatch(matchId: number, data: Partial<Match>) {
  const db = await getDb();
  if (!db) return;
  await db.update(matches).set(data).where(eq(matches.id, matchId));
}

export async function getMessages(matchId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(messages)
    .where(eq(messages.matchId, matchId))
    .orderBy(messages.createdAt)
    .limit(100);
}

export async function createMessage(matchId: number, senderId: number, content: string, filtered = false) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(messages).values({ matchId, senderId, content, filtered });
  const result = await db
    .select()
    .from(messages)
    .where(and(eq(messages.matchId, matchId), eq(messages.senderId, senderId)))
    .orderBy(desc(messages.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createSubscription(
  userId: number,
  tier: "spark" | "flame",
  stripeSessionId: string,
  amount: string,
  months = 1
) {
  const db = await getDb();
  if (!db) return null;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + months);
  await db.insert(subscriptions).values({
    userId,
    tier,
    stripeSessionId,
    status: "active",
    amount,
    currency: "GBP",
    expiresAt,
  });
  // Update user tier
  await db.update(users).set({ tier, tierExpiresAt: expiresAt }).where(eq(users.id, userId));
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

// ── Knock notification helpers ───────────────────────────────────────────────

export async function createKnockNotification(
  matchId: number,
  knockerId: number,
  receiverId: number
) {
  const db = await getDb();
  if (!db) return null;
  // Check if a pending notification already exists
  const existing = await db
    .select()
    .from(knockNotifications)
    .where(
      and(
        eq(knockNotifications.matchId, matchId),
        eq(knockNotifications.knockerId, knockerId),
        eq(knockNotifications.receiverId, receiverId),
        eq(knockNotifications.status, "pending")
      )
    )
    .limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(knockNotifications).values({ matchId, knockerId, receiverId });
  const created = await db
    .select()
    .from(knockNotifications)
    .where(
      and(
        eq(knockNotifications.matchId, matchId),
        eq(knockNotifications.knockerId, knockerId),
        eq(knockNotifications.receiverId, receiverId)
      )
    )
    .orderBy(desc(knockNotifications.createdAt))
    .limit(1);
  return created.length > 0 ? created[0] : null;
}

export async function getPendingNotifications(receiverId: number) {
  const db = await getDb();
  if (!db) return [];
  // Return all non-cleared notifications (pending + accepted + rejected shown until cleared)
  return db
    .select()
    .from(knockNotifications)
    .where(
      and(
        eq(knockNotifications.receiverId, receiverId),
        sql`${knockNotifications.clearedAt} IS NULL`
      )
    )
    .orderBy(desc(knockNotifications.createdAt));
}

export async function getKnockNotificationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(knockNotifications)
    .where(eq(knockNotifications.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateKnockNotification(
  id: number,
  data: Partial<typeof knockNotifications.$inferInsert>
) {
  const db = await getDb();
  if (!db) return;
  await db.update(knockNotifications).set(data as any).where(eq(knockNotifications.id, id));
}

// Check if knocker is on cooldown for a specific receiver (6-hour block after final rejection)
export async function getKnockCooldown(knockerId: number, receiverId: number) {
  const db = await getDb();
  if (!db) return null;
  const now = new Date();
  const result = await db
    .select()
    .from(knockNotifications)
    .where(
      and(
        eq(knockNotifications.knockerId, knockerId),
        eq(knockNotifications.receiverId, receiverId),
        eq(knockNotifications.status, "rejected"),
        gt(knockNotifications.cooldownUntil, now)
      )
    )
    .orderBy(desc(knockNotifications.updatedAt))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function filterMessageContent(content: string): Promise<{ filtered: boolean; content: string }> {
  // Regex patterns to detect phone numbers, emails, social links
  const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/g;
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const socialRegex = /(instagram|twitter|tiktok|snapchat|facebook|whatsapp|telegram|discord|linkedin|t\.me|wa\.me|ig\.me)\S*/gi;
  const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

  let filtered = false;
  let result = content;

  if (phoneRegex.test(result) || emailRegex.test(result) || socialRegex.test(result) || urlRegex.test(result)) {
    filtered = true;
    result = result
      .replace(phoneRegex, "***** (subscribe)")
      .replace(emailRegex, "***** (subscribe)")
      .replace(socialRegex, "***** (subscribe)")
      .replace(urlRegex, "***** (subscribe)");
  }

  return { filtered, content: result };
}
