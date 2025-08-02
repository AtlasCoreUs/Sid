import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Stripe from 'stripe'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const checkoutSchema = z.object({
  priceId: z.string(),
  planType: z.enum(['pro', 'enterprise']),
  isEarlyAdopter: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { priceId, planType, isEarlyAdopter } = checkoutSchema.parse(body)

    // Créer ou récupérer le customer Stripe
    let customer: Stripe.Customer
    
    const existingCustomers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      })
    }

    // Appliquer la réduction Early Adopter si applicable
    const discounts = isEarlyAdopter ? [{
      coupon: 'EARLY_ADOPTER_50', // À créer dans Stripe Dashboard
    }] : []

    // Créer la session Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&plan=${planType}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?cancelled=true`,
      metadata: {
        userId: session.user.id,
        planId: planType,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planId: planType,
        },
      },
      discounts,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
      },
    })

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error('Erreur création checkout:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du checkout' },
      { status: 500 }
    )
  }
}