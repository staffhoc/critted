import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility
export const stripe = {
  get paymentMethods() {
    return getStripe().paymentMethods;
  },
  get billingPortal() {
    return getStripe().billingPortal;
  },
  get customers() {
    return getStripe().customers;
  },
  get subscriptions() {
    return getStripe().subscriptions;
  },
  get checkout() {
    return getStripe().checkout;
  },
};

export const PLAN_PRICES = {
  FREE: { monthly: 0, yearly: 0, stripePriceIdMonthly: null, stripePriceIdYearly: null },
  BASIC: {
    monthly: 2200, // $22
    yearly: 22000, // $220 (2 months free)
    stripePriceIdMonthly: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || null,
    stripePriceIdYearly: process.env.STRIPE_BASIC_YEARLY_PRICE_ID || null,
  },
  PRO: {
    monthly: 2700, // $27
    yearly: 27000, // $270
    stripePriceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || null,
    stripePriceIdYearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || null,
  },
  ENTERPRISE: {
    monthly: 9900, // $99
    yearly: 99000, // $990
    stripePriceIdMonthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || null,
    stripePriceIdYearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID || null,
  },
} as const;
