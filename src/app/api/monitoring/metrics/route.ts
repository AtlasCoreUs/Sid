import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Métriques de base
    const [
      totalUsers,
      totalApps,
      activeSubscriptions,
      recentSignups,
      monthlyRevenue
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total apps
      prisma.app.count(),
      
      // Active subscriptions
      prisma.subscription.count({
        where: {
          status: 'active'
        }
      }),
      
      // Signups last 24h
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Monthly revenue (simplified)
      prisma.payment.aggregate({
        where: {
          status: 'succeeded',
          createdAt: {
            gte: new Date(new Date().setDate(1)) // First day of month
          }
        },
        _sum: {
          amount: true
        }
      })
    ])

    // Performance metrics
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()

    return NextResponse.json({
      business: {
        totalUsers,
        totalApps,
        activeSubscriptions,
        recentSignups,
        monthlyRevenue: monthlyRevenue._sum.amount || 0
      },
      system: {
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
        },
        nodeVersion: process.version
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}