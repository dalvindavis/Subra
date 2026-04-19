import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { priceId, plan, userId, email } = await req.json()

    if (!priceId || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get or create Stripe customer
    let customerId: string | undefined

    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single()

      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id
      }
    }

    if (!customerId && email) {
      const customer = await stripe.customers.create({ email })
      customerId = customer.id

      if (userId) {
        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', userId)
      }
    }

    const isRecurring = plan === 'basic'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: isRecurring ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/analyze`,
      metadata: { userId: userId || '', plan },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}