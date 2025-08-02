import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validation pour créer une app
const createAppSchema = z.object({
  businessInfo: z.object({
    businessName: z.string().min(1),
    ownerName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    website: z.string().optional(),
    description: z.string().min(1),
  }),
  template: z.string().min(1),
  customization: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    accentColor: z.string(),
    fontStyle: z.enum(['modern', 'classic', 'playful', 'elegant']),
    logo: z.string().optional(),
    backgroundImage: z.string().optional(),
  }),
  features: z.array(z.string()),
})

// GET /api/apps - Récupérer toutes les apps de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const apps = await prisma.app.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        settings: true,
        analytics: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(apps)
  } catch (error) {
    console.error('Erreur lors de la récupération des apps:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/apps - Créer une nouvelle app
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
    const validatedData = createAppSchema.parse(body)

    // Générer un slug unique
    const baseSlug = validatedData.businessInfo.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    let slug = baseSlug
    let counter = 1
    
    // Vérifier l'unicité du slug
    while (await prisma.app.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Créer l'app avec ses settings
    const app = await prisma.app.create({
      data: {
        name: validatedData.businessInfo.businessName,
        slug,
        description: validatedData.businessInfo.description,
        template: validatedData.template,
        userId: session.user.id,
        settings: {
          create: {
            primaryColor: validatedData.customization.primaryColor,
            secondaryColor: validatedData.customization.secondaryColor,
            accentColor: validatedData.customization.accentColor,
            features: validatedData.features,
            metadata: {
              businessInfo: validatedData.businessInfo,
              fontStyle: validatedData.customization.fontStyle,
            },
          },
        },
        // Créer la page d'accueil par défaut
        pages: {
          create: {
            title: 'Accueil',
            slug: 'home',
            isHomePage: true,
            content: {
              sections: [
                {
                  type: 'hero',
                  content: {
                    title: validatedData.businessInfo.businessName,
                    subtitle: validatedData.businessInfo.description,
                  },
                },
              ],
            },
          },
        },
        // Initialiser les analytics
        analytics: {
          create: {
            visitors: 0,
            pageViews: 0,
            uniqueVisitors: 0,
            avgSessionTime: 0,
            bounceRate: 0,
            conversions: 0,
          },
        },
      },
      include: {
        settings: true,
      },
    })

    // Créer une notification pour l'utilisateur
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'APP_PUBLISHED',
        title: 'App créée avec succès !',
        message: `Votre app "${app.name}" est maintenant en ligne.`,
        data: { appId: app.id, appSlug: app.slug },
      },
    })

    return NextResponse.json(app, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création de l\'app:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}