import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

export const PLANS = {
  basic: {
    name: 'SavFlix Basic',
    price: 2.99,
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    interval: 'month',
  },
  lifetime: {
    name: 'SavFlix Lifetime',
    price: 39,
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID!,
    interval: 'once',
  },
};