import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { priceId, planId } = await request.json()

    if (!priceId || !planId) {
      return NextResponse.json(
        { error: 'Prix ou plan manquant' },
        { status: 400 }
      )
    }

    // Récupérer ou créer le customer Stripe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      // Créer un nouveau customer Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })

      customerId = customer.id

      // Sauvegarder le customerId
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Créer la session Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: planId,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'fr',
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Erreur Stripe checkout:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du checkout' },
      { status: 500 }
    )
  }
}

// GET - Vérifier le statut de l'abonnement
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Si pas d'abonnement, retourner le plan gratuit
    if (!user.subscription) {
      return NextResponse.json({
        plan: 'free',
        status: 'active',
        features: {
          maxApps: 1,
          maxVisitors: 100,
          customDomain: false,
          analytics: 'basic',
          api: false,
          whiteLabel: false,
        },
      })
    }

    // Retourner les détails de l'abonnement
    return NextResponse.json({
      plan: user.subscription.plan,
      status: user.subscription.stripeStatus,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: false,
      features: getPlanFeatures(user.subscription.plan),
    })
  } catch (error) {
    console.error('Erreur récupération abonnement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

function getPlanFeatures(plan: string) {
  switch (plan) {
    case 'pro':
      return {
        maxApps: 5,
        maxVisitors: 10000,
        customDomain: true,
        analytics: 'advanced',
        api: true,
        whiteLabel: false,
      }
    case 'enterprise':
      return {
        maxApps: -1, // Illimité
        maxVisitors: -1,
        customDomain: true,
        analytics: 'realtime',
        api: true,
        whiteLabel: true,
      }
    default:
      return {
        maxApps: 1,
        maxVisitors: 100,
        customDomain: false,
        analytics: 'basic',
        api: false,
        whiteLabel: false,
      }
  }
}