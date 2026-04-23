import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature')!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session    = event.data.object as Stripe.Checkout.Session;
        const userId     = session.metadata?.userId;
        const plan       = session.metadata?.plan;
        const email      = session.customer_details?.email || session.customer_email;
        const customerId = session.customer as string;

        if (userId && plan) {
          const planValue = plan === 'lifetime' ? 'lifetime' : plan === 'pro' ? 'pro' : 'basic';
          await supabaseAdmin
            .from('profiles')
            .update({
              plan: planValue,
              scan_count: 0,
              stripe_customer_id: customerId,
              ...(email ? { email } : {}),
            })
            .eq('id', userId);
        } else if (email && !userId) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();
          if (profile && plan) {
            await supabaseAdmin
              .from('profiles')
              .update({
                plan: plan === 'lifetime' ? 'lifetime' : plan === 'pro' ? 'pro' : 'basic',
                scan_count: 0,
                stripe_customer_id: customerId,
              })
              .eq('id', profile.id);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub        = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();
        if (profile) {
          await supabaseAdmin
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', profile.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice    = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        console.warn('Payment failed for customer:', customerId);
        break;
      }
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}