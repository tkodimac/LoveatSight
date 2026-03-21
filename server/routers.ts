import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { sdk } from "./_core/sdk";
import {
  calcDistance,
  createKnockNotification,
  createMessage,
  createSubscription,
  filterMessageContent,
  getKnockCooldown,
  getKnockNotificationById,
  getMatchById,
  getMessages,
  getNearbyUsers,
  getOrCreateMatch,
  getPendingNotifications,
  getUserByEmail,
  getUserById,
  getUserMatches,
  updateKnockNotification,
  updateMatch,
  updateUserProfile,
  upsertUser,
} from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),

    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(6).max(100),
        displayName: z.string().min(1).max(100).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await getUserByEmail(input.email);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "Email already registered" });
        const passwordHash = await bcrypt.hash(input.password, 10);
        const openId = `email-${nanoid(16)}`;
        await upsertUser({
          openId,
          email: input.email,
          name: input.displayName ?? input.email.split("@")[0],
          loginMethod: "email",
          lastSignedIn: new Date(),
        });
        // Set password hash separately
        const newUser = await getUserByEmail(input.email);
        if (!newUser) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await updateUserProfile(newUser.id, { passwordHash });
        if (input.displayName) await updateUserProfile(newUser.id, { displayName: input.displayName });
        // Issue session cookie
        const sessionToken = await sdk.createSessionToken(openId, { name: newUser.name ?? "" });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { success: true };
      }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        await updateUserProfile(user.id, { lastSignedIn: new Date() } as any);
        const sessionToken = await sdk.createSessionToken(user.openId, { name: user.name ?? "" });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { success: true };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      return user;
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        displayName: z.string().min(1).max(100).optional(),
        bio: z.string().max(500).optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        locationCity: z.string().max(100).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),

    completeAgeGate: protectedProcedure
      .input(z.object({
        birthDate: z.string(), // YYYY-MM-DD
        age: z.number().int().min(18).max(120),
      }))
      .mutation(async ({ ctx, input }) => {
        if (input.age < 18) throw new TRPCError({ code: "BAD_REQUEST", message: "Must be 18+" });
        await updateUserProfile(ctx.user.id, {
          birthDate: input.birthDate,
          age: input.age,
          ageVerified: true,
        });
        return { success: true };
      }),

    completeFaceVerify: protectedProcedure
      .input(z.object({
        facePhotoUrl: z.string().optional(),
        skipped: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, {
          faceVerified: true,
          facePhotoUrl: input.facePhotoUrl ?? null,
          profileComplete: true,
        });
        return { success: true };
      }),

    updateLocation: protectedProcedure
      .input(z.object({
        latitude: z.number(),
        longitude: z.number(),
        locationCity: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),

    getNearby: protectedProcedure
      .input(z.object({
        latitude: z.number(),
        longitude: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const nearby = await getNearbyUsers(ctx.user.id, input.latitude, input.longitude);
        return nearby.map(u => ({
          id: u.id,
          displayName: u.displayName ?? u.name ?? "Anonymous",
          age: u.age,
          distance: calcDistance(input.latitude, input.longitude, u.latitude ?? 0, u.longitude ?? 0),
          tier: u.tier,
          faceVerified: u.faceVerified,
          // Never expose face photo until revealed
          avatarUrl: null,
        }));
      }),
  }),

  match: router({
    knock: protectedProcedure
      .input(z.object({ targetUserId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Check 6-hour cooldown after rejection
        const cooldown = await getKnockCooldown(ctx.user.id, input.targetUserId);
        if (cooldown) {
          const remaining = Math.ceil(
            (new Date(cooldown.cooldownUntil!).getTime() - Date.now()) / (1000 * 60)
          );
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `You were rejected. Try again in ${remaining} minutes.`,
          });
        }
        const match = await getOrCreateMatch(ctx.user.id, input.targetUserId);
        if (!match) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        // Determine who is the receiver
        const receiverId = match.userId1 === ctx.user.id ? match.userId2 : match.userId1;
        await createKnockNotification(match.id, ctx.user.id, receiverId);
        return { success: true, matchId: match.id };
      }),

    like: protectedProcedure
      .input(z.object({ matchId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const match = await getMatchById(input.matchId);
        if (!match) throw new TRPCError({ code: "NOT_FOUND" });
        const isUser1 = match.userId1 === ctx.user.id;
        const isUser2 = match.userId2 === ctx.user.id;
        if (!isUser1 && !isUser2) throw new TRPCError({ code: "FORBIDDEN" });

        const update: Record<string, unknown> = {};
        if (isUser1) update.user1Liked = true;
        else update.user2Liked = true;

        const newUser1Liked = isUser1 ? true : match.user1Liked;
        const newUser2Liked = isUser2 ? true : match.user2Liked;
        if (newUser1Liked && newUser2Liked) update.status = "mutual";

        await updateMatch(input.matchId, update as Parameters<typeof updateMatch>[1]);
        return { success: true, mutual: newUser1Liked && newUser2Liked };
      }),

    unlike: protectedProcedure
      .input(z.object({ matchId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const match = await getMatchById(input.matchId);
        if (!match) throw new TRPCError({ code: "NOT_FOUND" });
        const isUser1 = match.userId1 === ctx.user.id;
        const isUser2 = match.userId2 === ctx.user.id;
        if (!isUser1 && !isUser2) throw new TRPCError({ code: "FORBIDDEN" });

        const update: Record<string, unknown> = {};
        if (isUser1) update.user1Liked = false;
        else update.user2Liked = false;
        update.status = "knocked";

        await updateMatch(input.matchId, update as Parameters<typeof updateMatch>[1]);
        return { success: true };
      }),

    reveal: protectedProcedure
      .input(z.object({ matchId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const match = await getMatchById(input.matchId);
        if (!match) throw new TRPCError({ code: "NOT_FOUND" });
        const isUser1 = match.userId1 === ctx.user.id;
        const isUser2 = match.userId2 === ctx.user.id;
        if (!isUser1 && !isUser2) throw new TRPCError({ code: "FORBIDDEN" });

        // Check user has paid tier
        const user = await getUserById(ctx.user.id);
        if (!user || user.tier === "free") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Subscription required to reveal" });
        }

        const update: Record<string, unknown> = {};
        if (isUser1) update.user1Revealed = true;
        else update.user2Revealed = true;

        const bothRevealed = isUser1 ? (true && match.user2Revealed) : (match.user1Revealed && true);
        if (bothRevealed) update.status = "revealed";

        await updateMatch(input.matchId, update as Parameters<typeof updateMatch>[1]);

        // Get the other user's face photo
        const otherUserId = isUser1 ? match.userId2 : match.userId1;
        const otherUser = await getUserById(otherUserId);

        return {
          success: true,
          otherUser: {
            displayName: otherUser?.displayName ?? otherUser?.name ?? "Anonymous",
            facePhotoUrl: otherUser?.facePhotoUrl ?? null,
            avatarUrl: otherUser?.avatarUrl ?? null,
          },
        };
      }),

    getMyMatches: protectedProcedure.query(async ({ ctx }) => {
      const myMatches = await getUserMatches(ctx.user.id);
      const enriched = await Promise.all(
        myMatches.map(async (m) => {
          const otherId = m.userId1 === ctx.user.id ? m.userId2 : m.userId1;
          const other = await getUserById(otherId);
          const iRevealed = m.userId1 === ctx.user.id ? m.user1Revealed : m.user2Revealed;
          return {
            matchId: m.id,
            status: m.status,
            user1Liked: m.user1Liked,
            user2Liked: m.user2Liked,
            iRevealed,
            otherUser: {
              id: other?.id,
              displayName: other?.displayName ?? other?.name ?? "Anonymous",
              age: other?.age,
              facePhotoUrl: iRevealed ? (other?.facePhotoUrl ?? null) : null,
              avatarUrl: iRevealed ? (other?.avatarUrl ?? null) : null,
            },
            updatedAt: m.updatedAt,
          };
        })
      );
      return enriched;
    }),

    getMatch: protectedProcedure
      .input(z.object({ matchId: z.number() }))
      .query(async ({ ctx, input }) => {
        const match = await getMatchById(input.matchId);
        if (!match) throw new TRPCError({ code: "NOT_FOUND" });
        const isUser1 = match.userId1 === ctx.user.id;
        const isUser2 = match.userId2 === ctx.user.id;
        if (!isUser1 && !isUser2) throw new TRPCError({ code: "FORBIDDEN" });

        const otherId = isUser1 ? match.userId2 : match.userId1;
        const other = await getUserById(otherId);
        const iRevealed = isUser1 ? match.user1Revealed : match.user2Revealed;
        const iLiked = isUser1 ? match.user1Liked : match.user2Liked;

        return {
          matchId: match.id,
          status: match.status,
          iLiked,
          iRevealed,
          mutual: match.user1Liked && match.user2Liked,
          otherUser: {
            id: other?.id,
            displayName: other?.displayName ?? other?.name ?? "Anonymous",
            age: other?.age,
            facePhotoUrl: iRevealed ? (other?.facePhotoUrl ?? null) : null,
            avatarUrl: iRevealed ? (other?.avatarUrl ?? null) : null,
          },
        };
      }),
  }),

  message: router({
    getMessages: protectedProcedure
      .input(z.object({ matchId: z.number() }))
      .query(async ({ ctx, input }) => {
        const match = await getMatchById(input.matchId);
        if (!match) throw new TRPCError({ code: "NOT_FOUND" });
        const isUser1 = match.userId1 === ctx.user.id;
        const isUser2 = match.userId2 === ctx.user.id;
        if (!isUser1 && !isUser2) throw new TRPCError({ code: "FORBIDDEN" });
        return getMessages(input.matchId);
      }),

    send: protectedProcedure
      .input(z.object({
        matchId: z.number(),
        content: z.string().min(1).max(2000),
      }))
      .mutation(async ({ ctx, input }) => {
        const match = await getMatchById(input.matchId);
        if (!match) throw new TRPCError({ code: "NOT_FOUND" });
        const isUser1 = match.userId1 === ctx.user.id;
        const isUser2 = match.userId2 === ctx.user.id;
        if (!isUser1 && !isUser2) throw new TRPCError({ code: "FORBIDDEN" });

        const { filtered, content } = await filterMessageContent(input.content);
        const msg = await createMessage(input.matchId, ctx.user.id, content, filtered);
        return { success: true, message: msg, filtered };
      }),
  }),

  notification: router({
    getMyNotifications: protectedProcedure.query(async ({ ctx }) => {
      const notifs = await getPendingNotifications(ctx.user.id);
      // Enrich with knocker info
      const enriched = await Promise.all(
        notifs.map(async (n) => {
          const knocker = await getUserById(n.knockerId);
          return {
            id: n.id,
            matchId: n.matchId,
            knockerId: n.knockerId,
            status: n.status,
            rejectCount: n.rejectCount,
            cooldownUntil: n.cooldownUntil,
            createdAt: n.createdAt,
            knocker: {
              displayName: knocker?.displayName ?? knocker?.name ?? "Someone",
              age: knocker?.age ?? null,
            },
          };
        })
      );
      return enriched;
    }),

    accept: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const notif = await getKnockNotificationById(input.notificationId);
        if (!notif) throw new TRPCError({ code: "NOT_FOUND" });
        if (notif.receiverId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        await updateKnockNotification(notif.id, { status: "accepted" });
        // Update match status to knocked (acknowledged)
        await updateMatch(notif.matchId, { status: "knocked" });
        return { success: true, matchId: notif.matchId };
      }),

    // First call: rejectCount < 1 → increment rejectCount and return "confirm" signal
    // Second call: rejectCount >= 1 → set status=rejected + 6h cooldown
    reject: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const notif = await getKnockNotificationById(input.notificationId);
        if (!notif) throw new TRPCError({ code: "NOT_FOUND" });
        if (notif.receiverId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });

        if (notif.rejectCount < 1) {
          // First press — ask for confirmation
          await updateKnockNotification(notif.id, { rejectCount: 1 });
          return { confirmed: false, message: "Are you sure? This will block them for 6 hours." };
        }
        // Second press — final rejection with 6-hour cooldown
        const cooldownUntil = new Date(Date.now() + 6 * 60 * 60 * 1000);
        await updateKnockNotification(notif.id, { status: "rejected", cooldownUntil });
        return { confirmed: true };
      }),

    ignore: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const notif = await getKnockNotificationById(input.notificationId);
        if (!notif) throw new TRPCError({ code: "NOT_FOUND" });
        if (notif.receiverId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        await updateKnockNotification(notif.id, { status: "ignored" });
        return { success: true };
      }),

    clear: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const notif = await getKnockNotificationById(input.notificationId);
        if (!notif) throw new TRPCError({ code: "NOT_FOUND" });
        if (notif.receiverId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        await updateKnockNotification(notif.id, { clearedAt: new Date() });
        return { success: true };
      }),

    clearAll: protectedProcedure.mutation(async ({ ctx }) => {
      const notifs = await getPendingNotifications(ctx.user.id);
      await Promise.all(
        notifs
          .filter(n => n.status !== "pending") // keep pending ones visible
          .map(n => updateKnockNotification(n.id, { clearedAt: new Date() }))
      );
      return { success: true };
    }),
  }),

  subscription: router({
    activate: protectedProcedure
      .input(z.object({
        tier: z.enum(["spark", "flame"]),
        sessionId: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const amount = input.tier === "spark" ? "2.00" : "5.00";
        const sub = await createSubscription(ctx.user.id, input.tier, input.sessionId, amount);
        return { success: true, subscription: sub };
      }),

    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      return {
        tier: user?.tier ?? "free",
        tierExpiresAt: user?.tierExpiresAt ?? null,
        revealCount: user?.revealCount ?? 0,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
