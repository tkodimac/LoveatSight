import {
  boolean,
  decimal,
  float,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  // Dating app specific fields
  displayName: varchar("displayName", { length: 100 }),
  birthDate: varchar("birthDate", { length: 10 }), // YYYY-MM-DD
  age: int("age"),
  ageVerified: boolean("ageVerified").default(false).notNull(),
  faceVerified: boolean("faceVerified").default(false).notNull(),
  facePhotoUrl: text("facePhotoUrl"),
  avatarUrl: text("avatarUrl"),
  bio: text("bio"),
  latitude: float("latitude"),
  longitude: float("longitude"),
  locationCity: varchar("locationCity", { length: 100 }),
  tier: mysqlEnum("tier", ["free", "spark", "flame"]).default("free").notNull(),
  tierExpiresAt: timestamp("tierExpiresAt"),
  revealCount: int("revealCount").default(0).notNull(),
  revealResetAt: timestamp("revealResetAt"),
  profileComplete: boolean("profileComplete").default(false).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  userId1: int("userId1").notNull(),
  userId2: int("userId2").notNull(),
  // knock = user1 knocked on user2
  // liked = both liked each other
  status: mysqlEnum("status", ["knocked", "liked", "mutual", "revealed"]).default("knocked").notNull(),
  user1Liked: boolean("user1Liked").default(false).notNull(),
  user2Liked: boolean("user2Liked").default(false).notNull(),
  user1Revealed: boolean("user1Revealed").default(false).notNull(),
  user2Revealed: boolean("user2Revealed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content").notNull(),
  filtered: boolean("filtered").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tier: mysqlEnum("tier", ["spark", "flame"]).notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "active", "cancelled", "expired"]).default("pending").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("GBP"),
  startsAt: timestamp("startsAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export const knockNotifications = mysqlTable("knock_notifications", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  knockerId: int("knockerId").notNull(),    // user who knocked
  receiverId: int("receiverId").notNull(),  // user who receives the notification
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "ignored"]).default("pending").notNull(),
  rejectCount: int("rejectCount").default(0).notNull(), // increments on first reject prompt
  cooldownUntil: timestamp("cooldownUntil"),            // set after final rejection (6h)
  busyUntil: timestamp("busyUntil"),                     // set after ignore (15 min)
  clearedAt: timestamp("clearedAt"),                    // when receiver cleared it
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnockNotification = typeof knockNotifications.$inferSelect;
export type InsertKnockNotification = typeof knockNotifications.$inferInsert;
