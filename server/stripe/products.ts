/**
 * Love at Sight — Stripe product/price definitions.
 * These are created dynamically via the Checkout Session API (no pre-created Price IDs needed).
 */

export const STRIPE_PRODUCTS = {
  spark: {
    name: "Spark — Love at Sight",
    description: "Unlimited knocks + 1 reveal per month",
    amount: 200, // £2.00 in pence
    currency: "gbp",
    tier: "spark" as const,
    interval: "month" as const,
  },
  flame: {
    name: "Flame — Love at Sight",
    description: "Unlimited reveals + all premium features",
    amount: 500, // £5.00 in pence
    currency: "gbp",
    tier: "flame" as const,
    interval: "month" as const,
  },
} as const;

export type StripeTier = keyof typeof STRIPE_PRODUCTS;
