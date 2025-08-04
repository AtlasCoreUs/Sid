import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Schema de validation
const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.object({
    step: z.string().optional(),
    businessInfo: z.any().optional(),
    template: z.string().optional(),
    features: z.array(z.string()).optional(),
  }).optional(),
  conversationId: z.string().optional(),
})

// Prompts système pour SID
const SYSTEM_PROMPTS = {
  general: `Tu es SID, l'assistant IA intelligent pour la création d'applications personnalisées. 
Tu es enthousiaste, créatif et expert en technologie. Tu aides les utilisateurs à créer des apps incroyables.
Tu maîtrises les abréviations et le langage moderne. Tu peux suggérer des idées innovantes.
Réponds toujours en français de manière concise et engageante.`,
  
  businessInfo: `Tu aides l'utilisateur à remplir les informations de son entreprise.
Pose des questions pertinentes si des informations manquent.
Suggère des améliorations pour la description.`,
  
  template: `Tu conseilles sur le choix du template idéal selon l'activité.
Explique les avantages de chaque template.
Recommande basé sur le type d'entreprise.`,
  
  features: `Tu recommandes les fonctionnalités essentielles pour l'app.
Explique comment chaque fonctionnalité peut aider l'entreprise.
Suggère des combinaisons intelligentes.`,
  
  customization: `Tu aides à choisir les couleurs et le design.
Donne des conseils sur l'harmonie des couleurs.
Suggère des palettes selon le secteur d'activité.`,
}

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
    const { message, context, conversationId } = chatSchema.parse(body)

    // Déterminer le prompt système approprié
    const systemPrompt = context?.step 
      ? SYSTEM_PROMPTS[context.step as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.general
      : SYSTEM_PROMPTS.general

    // Créer le contexte enrichi
    let contextMessage = ''
    if (context?.businessInfo) {
      contextMessage += `\nEntreprise: ${context.businessInfo.businessName}, ${context.businessInfo.description}`
    }
    if (context?.template) {
      contextMessage += `\nTemplate choisi: ${context.template}`
    }
    if (context?.features?.length) {
      contextMessage += `\nFonctionnalités sélectionnées: ${context.features.join(', ')}`
    }

    // Récupérer l'historique de conversation si existe
    let messages: any[] = [{ role: 'system', content: systemPrompt }]
    
    if (conversationId) {
      const conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId },
      })
      if (conversation?.messages) {
        messages.push(...(conversation.messages as any[]))
      }
    }

    // Ajouter le contexte et le nouveau message
    if (contextMessage) {
      messages.push({ role: 'system', content: `Contexte actuel:${contextMessage}` })
    }
    messages.push({ role: 'user', content: message })

    // Appel à OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    })

    const aiResponse = completion.choices[0].message.content || ''

    // Sauvegarder ou mettre à jour la conversation
    let updatedConversation
    if (conversationId) {
      updatedConversation = await prisma.aIConversation.update({
        where: { id: conversationId },
        data: {
          messages: [...messages, { role: 'assistant', content: aiResponse }],
        },
      })
    } else {
      updatedConversation = await prisma.aIConversation.create({
        data: {
          userId: session.user.id,
          messages: [...messages, { role: 'assistant', content: aiResponse }],
        },
      })
    }

    return NextResponse.json({
      response: aiResponse,
      conversationId: updatedConversation.id,
    })
  } catch (error) {
    console.error('Erreur API AI:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête IA' },
      { status: 500 }
    )
  }
}

// GET /api/ai/chat - Récupérer l'historique des conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const conversations = await prisma.aIConversation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        createdAt: true,
      },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Erreur récupération conversations:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}