import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";
import { filterMessageContent } from "./db";

// ── Helpers ──────────────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeUser(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    id: 1,
    openId: "test-user-1",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    displayName: "Test",
    birthDate: "1990-01-01",
    age: 34,
    ageVerified: true,
    faceVerified: true,
    facePhotoUrl: null,
    avatarUrl: null,
    bio: null,
    latitude: 51.5074,
    longitude: -0.1278,
    locationCity: "London",
    tier: "free",
    tierExpiresAt: null,
    revealCount: 0,
    revealResetAt: null,
    profileComplete: true,
    ...overrides,
  };
}

function makeCtx(user: AuthenticatedUser | null = makeUser()): TrpcContext {
  const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
}

// ── Auth tests ────────────────────────────────────────────────────────────────

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];
    const ctx: TrpcContext = {
      user: makeUser(),
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1 });
  });

  it("returns current user when authenticated", async () => {
    const user = makeUser({ name: "Alice" });
    const caller = appRouter.createCaller(makeCtx(user));
    const result = await caller.auth.me();
    expect(result?.name).toBe("Alice");
  });

  it("returns null when not authenticated", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

// ── Message filter tests ──────────────────────────────────────────────────────

describe("filterMessageContent", () => {
  it("passes clean messages through unfiltered", async () => {
    const { filtered, content } = await filterMessageContent("Hey! How are you doing today?");
    expect(filtered).toBe(false);
    expect(content).toBe("Hey! How are you doing today?");
  });

  it("filters phone numbers", async () => {
    const { filtered, content } = await filterMessageContent("Call me on 07700 900123 please");
    expect(filtered).toBe(true);
    expect(content).toContain("***** (subscribe)");
    expect(content).not.toContain("07700 900123");
  });

  it("filters email addresses", async () => {
    const { filtered, content } = await filterMessageContent("Email me at alice@example.com");
    expect(filtered).toBe(true);
    expect(content).toContain("***** (subscribe)");
    expect(content).not.toContain("alice@example.com");
  });

  it("filters social media handles/links", async () => {
    const { filtered, content } = await filterMessageContent("Find me on instagram @alice_xyz");
    expect(filtered).toBe(true);
    expect(content).toContain("***** (subscribe)");
  });

  it("filters HTTP URLs", async () => {
    const { filtered, content } = await filterMessageContent("Visit https://example.com for more");
    expect(filtered).toBe(true);
    expect(content).toContain("***** (subscribe)");
    expect(content).not.toContain("https://example.com");
  });

  it("filters WhatsApp links", async () => {
    const { filtered, content } = await filterMessageContent("Message me on whatsapp.com/alice");
    expect(filtered).toBe(true);
    expect(content).toContain("***** (subscribe)");
  });

  it("preserves normal text with numbers that are not phone numbers", async () => {
    const { filtered, content } = await filterMessageContent("I have 3 cats and 2 dogs!");
    expect(filtered).toBe(false);
    expect(content).toBe("I have 3 cats and 2 dogs!");
  });

  it("filters international phone numbers", async () => {
    const { filtered, content } = await filterMessageContent("Call +44 7700 900123");
    expect(filtered).toBe(true);
    expect(content).toContain("***** (subscribe)");
  });
});

// ── Subscription router tests ─────────────────────────────────────────────────

describe("subscription.getStatus", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.subscription.getStatus()).rejects.toThrow();
  });
});

describe("user.completeAgeGate", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.user.completeAgeGate({ birthDate: "1990-01-01", age: 34 })
    ).rejects.toThrow();
  });

  it("rejects age under 18 via Zod validation", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    await expect(
      caller.user.completeAgeGate({ birthDate: "2010-01-01", age: 14 })
    ).rejects.toThrow(); // Zod rejects age < 18 at schema level
  });
});

// ── Match router tests ────────────────────────────────────────────────────────

describe("match.knock", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.match.knock({ targetUserId: 2 })).rejects.toThrow();
  });
});

describe("match.like", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.match.like({ matchId: 1 })).rejects.toThrow();
  });
});

describe("message.send", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.message.send({ matchId: 1, content: "Hello!" })
    ).rejects.toThrow();
  });
});
