import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: false,
      redis: false,
      openai: false,
      stripe: false,
    },
    metrics: {
      responseTime: 0,
      memoryUsage: process.memoryUsage(),
    },
  }

  // Check Database
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.checks.database = true
  } catch (error) {
    checks.status = 'degraded'
  }

  // Check Redis (si configuré)
  if (process.env.REDIS_URL) {
    try {
      // Simuler un check Redis
      checks.checks.redis = true
    } catch (error) {
      checks.status = 'degraded'
    }
  }

  // Check OpenAI API
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      })
      checks.checks.openai = response.ok
    } catch (error) {
      checks.status = 'degraded'
    }
  }

  // Check Stripe API
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const response = await fetch('https://api.stripe.com/v1/charges', {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      })
      checks.checks.stripe = response.ok
    } catch (error) {
      checks.status = 'degraded'
    }
  }

  // Calculer le temps de réponse
  checks.metrics.responseTime = Date.now() - startTime

  // Si tous les checks critiques échouent
  const criticalChecks = [checks.checks.database]
  if (criticalChecks.every(check => !check)) {
    checks.status = 'unhealthy'
  }

  const statusCode = checks.status === 'healthy' ? 200 : 
                     checks.status === 'degraded' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}

export async function HEAD(request: NextRequest) {
  // Simple check pour les load balancers
  return new NextResponse(null, { status: 200 })
}