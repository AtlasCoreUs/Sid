import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

// Schema de validation
const webhookSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  events: z.array(z.enum([
    'app.created',
    'app.updated',
    'app.deleted',
    'app.published',
    'user.created',
    'user.updated',
    'subscription.created',
    'subscription.updated',
    'subscription.cancelled',
    'payment.success',
    'payment.failed',
  ])),
  active: z.boolean().default(true),
  headers: z.record(z.string()).optional(),
})

// GET /api/webhooks - Lister les webhooks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const webhooks = await prisma.webhook.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(webhooks)
  } catch (error) {
    console.error('Erreur webhooks:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/webhooks - Créer un webhook
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = webhookSchema.parse(body)

    // Vérifier la limite de webhooks (10 par utilisateur)
    const webhookCount = await prisma.webhook.count({
      where: { userId: session.user.id },
    })

    if (webhookCount >= 10) {
      return NextResponse.json(
        { error: 'Limite de webhooks atteinte (10 max)' },
        { status: 400 }
      )
    }

    // Générer un secret pour signer les payloads
    const secret = crypto.randomBytes(32).toString('hex')

    const webhook = await prisma.webhook.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        url: validatedData.url,
        events: validatedData.events,
        active: validatedData.active,
        headers: validatedData.headers || {},
        secret,
      },
    })

    return NextResponse.json({
      ...webhook,
      secret, // Retourner le secret une seule fois
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur création webhook:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/webhooks/[id] - Supprimer un webhook
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier que le webhook appartient à l'utilisateur
    const webhook = await prisma.webhook.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!webhook) {
      return NextResponse.json(
        { error: 'Webhook non trouvé' },
        { status: 404 }
      )
    }

    await prisma.webhook.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Webhook supprimé' })
  } catch (error) {
    console.error('Erreur suppression webhook:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}