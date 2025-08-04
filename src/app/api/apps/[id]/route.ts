import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validation pour update
const updateAppSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  settings: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    features: z.array(z.string()).optional(),
    metadata: z.any().optional(),
  }).optional(),
  pages: z.array(z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.any(),
    isHomePage: z.boolean(),
  })).optional(),
})

// GET /api/apps/[id] - Récupérer une app spécifique
export async function GET(
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

    const app = await prisma.app.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        settings: true,
        pages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        analytics: {
          orderBy: {
            date: 'desc',
          },
          take: 30,
        },
      },
    })

    if (!app) {
      return NextResponse.json(
        { error: 'App non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(app)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'app:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/apps/[id] - Mettre à jour une app
export async function PUT(
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

    const body = await request.json()
    const validatedData = updateAppSchema.parse(body)

    // Vérifier que l'app appartient à l'utilisateur
    const existingApp = await prisma.app.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingApp) {
      return NextResponse.json(
        { error: 'App non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour l'app
    const updatedApp = await prisma.$transaction(async (tx) => {
      // Update app basic info
      const app = await tx.app.update({
        where: { id: params.id },
        data: {
          name: validatedData.name,
          description: validatedData.description,
        },
      })

      // Update settings if provided
      if (validatedData.settings) {
        await tx.appSettings.update({
          where: { appId: params.id },
          data: validatedData.settings,
        })
      }

      // Update pages if provided
      if (validatedData.pages) {
        for (const page of validatedData.pages) {
          await tx.page.upsert({
            where: { id: page.id },
            create: {
              ...page,
              appId: params.id,
              content: page.content || {},
            },
            update: {
              title: page.title,
              slug: page.slug,
              content: page.content,
              isHomePage: page.isHomePage,
            },
          })
        }
      }

      return app
    })

    // Récupérer l'app complète
    const fullApp = await prisma.app.findUnique({
      where: { id: params.id },
      include: {
        settings: true,
        pages: true,
      },
    })

    return NextResponse.json(fullApp)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la mise à jour de l\'app:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/apps/[id] - Supprimer une app
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

    // Vérifier que l'app appartient à l'utilisateur
    const app = await prisma.app.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!app) {
      return NextResponse.json(
        { error: 'App non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer l'app (cascade delete grâce aux relations)
    await prisma.app.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'App supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'app:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}