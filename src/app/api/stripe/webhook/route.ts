import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Erreur webhook signature:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Gérer les différents types d'événements
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const planId = session.metadata?.planId

  if (!userId || !planId) {
    console.error('Metadata manquante dans checkout session')
    return
  }

  // Récupérer la subscription
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

  // Créer ou mettre à jour l'abonnement dans la DB
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCustomerId: subscription.customer as string,
      plan: planId as any,
      status: subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      plan: planId as any,
      status: subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })

  // Créer une notification
  await prisma.notification.create({
    data: {
      userId,
      type: 'SUBSCRIPTION_UPDATED',
      title: 'Abonnement activé !',
      message: `Votre abonnement ${planId.toUpperCase()} est maintenant actif. Profitez de toutes les fonctionnalités !`,
      data: { plan: planId },
    },
  })
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('UserId manquant dans subscription metadata')
    return
  }

  // Mettre à jour l'abonnement
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('UserId manquant dans subscription metadata')
    return
  }

  // Marquer l'abonnement comme annulé
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    },
  })

  // Créer une notification
  await prisma.notification.create({
    data: {
      userId,
      type: 'SUBSCRIPTION_CANCELLED',
      title: 'Abonnement annulé',
      message: 'Votre abonnement a été annulé. Vous pouvez continuer à utiliser les fonctionnalités jusqu\'à la fin de la période.',
    },
  })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  
  // Récupérer l'utilisateur par customerId
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error('Utilisateur non trouvé pour customerId:', customerId)
    return
  }

  // Enregistrer le paiement
  await prisma.payment.create({
    data: {
      userId: user.id,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid / 100, // Convertir de cents en euros
      currency: invoice.currency,
      status: 'PAID',
    },
  })

  // Créer une notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'PAYMENT_SUCCESS',
      title: 'Paiement reçu',
      message: `Votre paiement de ${invoice.amount_paid / 100}€ a été reçu avec succès.`,
      data: { invoiceId: invoice.id },
    },
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  
  // Récupérer l'utilisateur par customerId
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error('Utilisateur non trouvé pour customerId:', customerId)
    return
  }

  // Enregistrer l'échec de paiement
  await prisma.payment.create({
    data: {
      userId: user.id,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
      status: 'FAILED',
    },
  })

  // Créer une notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'PAYMENT_FAILED',
      title: 'Échec du paiement',
      message: 'Votre paiement a échoué. Veuillez mettre à jour vos informations de paiement.',
      data: { invoiceId: invoice.id },
    },
  })
}