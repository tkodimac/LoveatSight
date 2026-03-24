import Stripe from "stripe";
import type { Express, Request, Response } from "express";
import { getDb } from "../db";
import { users, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

/**
 * Register Stripe webhook + checkout session endpoints.
 * Must be called BEFORE express.json() middleware so raw body is available for signature verification.
 */
export function registerStripeRoutes(app: Express) {
  // ── Webhook (raw body required for signature verification) ──────────────
  app.post(
    "/api/stripe/webhook",
    // express.raw is applied per-route here; the global express.json() must NOT run first
    (req: Request, res: Response, next) => {
      // If body is already a Buffer (raw), proceed; otherwise parse it
      if (Buffer.isBuffer(req.body)) return next();
      let data = "";
      req.setEncoding("utf8");
      req.on("data", (chunk: string) => { data += chunk; });
      req.on("end", () => {
        (req as Request & { rawBody?: string }).rawBody = data;
        req.body = Buffer.from(data);
        next();
      });
    },
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("[Stripe Webhook] Signature verification failed:", msg);
        return res.status(400).send(`Webhook Error: ${msg}`);
      }

      // ── Test event passthrough ──────────────────────────────────────────
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Event: ${event.type} (${event.id})`);

      try {
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutCompleted(session);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Handler error:", err);
        return res.status(500).json({ error: "Handler failed" });
      }

      res.json({ received: true });
    }
  );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id ? parseInt(session.metadata.user_id, 10) : null;
  const tier = session.metadata?.tier as "spark" | "flame" | undefined;

  if (!userId || !tier) {
    console.error("[Stripe Webhook] Missing user_id or tier in session metadata", session.id);
    return;
  }

  const db = await getDb();
  if (!db) return;

  // Set expiry: 1 month from now
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  // Update user tier
  await db.update(users)
    .set({ tier, tierExpiresAt: expiresAt })
    .where(eq(users.id, userId));

  // Record subscription
  await db.insert(subscriptions).values({
    userId,
    tier,
    stripeSessionId: session.id,
    stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
    status: "active",
    amount: tier === "spark" ? "2.00" : "5.00",
    currency: "GBP",
    startsAt: new Date(),
    expiresAt,
  });

  console.log(`[Stripe Webhook] Activated ${tier} for user ${userId} until ${expiresAt.toISOString()}`);
}

export { stripe };
