import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

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

    // Récupérer le range de dates
    const url = new URL(request.url)
    const range = url.searchParams.get('range') || '30d'
    
    // Calculer les dates
    const endDate = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
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

    // Récupérer les analytics
    const analytics = await prisma.appAnalytics.findMany({
      where: {
        appId: params.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Calculer les totaux
    const overview = analytics.reduce((acc, day) => ({
      totalVisitors: acc.totalVisitors + day.visitors,
      uniqueVisitors: acc.uniqueVisitors + day.uniqueVisitors,
      pageViews: acc.pageViews + day.pageViews,
      avgSessionTime: acc.avgSessionTime + day.avgSessionTime,
      bounceRate: acc.bounceRate + day.bounceRate,
      conversions: acc.conversions + day.conversions,
    }), {
      totalVisitors: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      avgSessionTime: 0,
      bounceRate: 0,
      conversions: 0,
    })

    // Moyennes
    if (analytics.length > 0) {
      overview.avgSessionTime = Math.round(overview.avgSessionTime / analytics.length)
      overview.bounceRate = Math.round(overview.bounceRate / analytics.length)
    }

    // Données temporelles
    const timeSeries = analytics.map(day => ({
      date: day.date.toISOString(),
      visitors: day.visitors,
      pageViews: day.pageViews,
      uniqueVisitors: day.uniqueVisitors,
    }))

    // Données simulées pour la démo (à remplacer par de vraies données)
    const topPages = [
      { path: '/', views: Math.round(overview.pageViews * 0.35), avgTime: 245 },
      { path: '/services', views: Math.round(overview.pageViews * 0.25), avgTime: 180 },
      { path: '/contact', views: Math.round(overview.pageViews * 0.20), avgTime: 120 },
      { path: '/about', views: Math.round(overview.pageViews * 0.15), avgTime: 90 },
      { path: '/gallery', views: Math.round(overview.pageViews * 0.05), avgTime: 300 },
    ]

    const devices = {
      desktop: Math.round(overview.totalVisitors * 0.55),
      mobile: Math.round(overview.totalVisitors * 0.35),
      tablet: Math.round(overview.totalVisitors * 0.10),
    }

    const sources = [
      { source: 'Direct', visitors: Math.round(overview.totalVisitors * 0.30), percentage: 30 },
      { source: 'Google', visitors: Math.round(overview.totalVisitors * 0.35), percentage: 35 },
      { source: 'Social Media', visitors: Math.round(overview.totalVisitors * 0.20), percentage: 20 },
      { source: 'Referral', visitors: Math.round(overview.totalVisitors * 0.10), percentage: 10 },
      { source: 'Autres', visitors: Math.round(overview.totalVisitors * 0.05), percentage: 5 },
    ]

    return NextResponse.json({
      app: {
        id: app.id,
        name: app.name,
        slug: app.slug,
      },
      overview,
      timeSeries,
      topPages,
      devices,
      sources,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}