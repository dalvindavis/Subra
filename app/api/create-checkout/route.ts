import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, plan, userId, email } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'lifetime' ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `https://www.savflix.com/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.savflix.com/analyze`,
      customer_email: email || undefined,
      billing_address_collection: 'auto',
      consent_collection: {
        payment_method_reuse_agreement: { position: 'auto' },
      },
      metadata: {
        userId: userId || '',
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}