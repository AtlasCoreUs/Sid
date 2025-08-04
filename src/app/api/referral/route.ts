import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

// Schema de validation
const createReferralSchema = z.object({
  email: z.string().email().optional(),
})

// GET /api/referral - Obtenir le code de parrainage et les stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer ou créer le code de parrainage
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        referralCode: true,
        referralStats: true,
      },
    })

    if (!user?.referralCode) {
      // Générer un code unique
      const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase()
      
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          referralCode,
          referralStats: {
            totalReferrals: 0,
            activeReferrals: 0,
            earnings: 0,
          },
        },
        select: {
          id: true,
          referralCode: true,
          referralStats: true,
        },
      })
    }

    // Récupérer les filleuls
    const referrals = await prisma.user.findMany({
      where: { referredBy: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscription: {
          select: {
            plan: true,
            stripeStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      referralCode: user.referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup?ref=${user.referralCode}`,
      stats: user.referralStats || {
        totalReferrals: referrals.length,
        activeReferrals: referrals.filter(r => r.subscription?.stripeStatus === 'active').length,
        earnings: 0,
      },
      referrals,
      rewards: {
        referrer: {
          free: '1 mois gratuit',
          pro: '2 mois gratuits',
          enterprise: '3 mois gratuits',
        },
        referred: {
          discount: '20% de réduction pendant 3 mois',
        },
      },
    })
  } catch (error) {
    console.error('Erreur referral:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/referral - Envoyer une invitation
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
    const { email } = createReferralSchema.parse(body)

    // Récupérer le code de parrainage
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        referralCode: true,
        name: true,
      },
    })

    if (!user?.referralCode) {
      return NextResponse.json(
        { error: 'Code de parrainage non trouvé' },
        { status: 404 }
      )
    }

    // TODO: Envoyer l'email d'invitation via SendGrid
    // await sendReferralEmail({
    //   to: email,
    //   referrerName: user.name,
    //   referralCode: user.referralCode,
    //   referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup?ref=${user.referralCode}`,
    // })

    // Enregistrer l'invitation
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'INFO',
        title: 'Invitation envoyée',
        message: `Invitation de parrainage envoyée à ${email}`,
        data: { email },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Invitation envoyée avec succès',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur invitation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/referral/claim - Réclamer une récompense
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier les conditions pour réclamer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        referralStats: true,
        referralCode: true,
      },
    })

    const stats = user?.referralStats as any
    if (!stats || stats.activeReferrals < 3) {
      return NextResponse.json(
        { error: 'Conditions non remplies (3 parrainages actifs minimum)' },
        { status: 400 }
      )
    }

    // Appliquer la récompense (ex: 1 mois gratuit)
    const currentSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (currentSubscription) {
      const newEndDate = new Date(currentSubscription.currentPeriodEnd)
      newEndDate.setMonth(newEndDate.getMonth() + 1)

      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: {
          currentPeriodEnd: newEndDate,
        },
      })
    }

    // Mettre à jour les stats
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        referralStats: {
          update: {
            lastClaimDate: new Date(),
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Récompense réclamée : 1 mois gratuit ajouté !',
    })
  } catch (error) {
    console.error('Erreur claim:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}