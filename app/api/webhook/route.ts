import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan
        if (userId && plan) {
          await supabase
            .from('profiles')
            .update({ plan: plan === 'lifetime' ? 'lifetime' : 'basic', stripe_customer_id: session.customer })
            .eq('id', userId)
        }
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()
        if (profile) {
          await supabase.from('profiles').update({ plan: 'free' }).eq('id', profile.id)
        }
        break
      }
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}