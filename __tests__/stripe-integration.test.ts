import { NextRequest } from 'next/server'
import { POST as stripeCheckout } from '@/app/api/stripe/checkout/route'
import { stripe } from '@/lib/stripe'

// Mock Stripe
jest.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn()
      }
    }
  }
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}))

describe('Stripe Checkout', () => {
  it('should create checkout session for PRO plan', async () => {
    const mockSession = {
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123'
    }

    ;(stripe.checkout.sessions.create as jest.Mock).mockResolvedValueOnce(mockSession)

    const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId: 'price_pro_123',
        userId: 'user_123'
      })
    })

    const response = await stripeCheckout(request)
    const data = await response.json()

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith({
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_pro_123',
        quantity: 1
      }],
      mode: 'subscription',
      metadata: {
        userId: 'user_123'
      },
      success_url: expect.stringContaining('/dashboard?success=true'),
      cancel_url: expect.stringContaining('/pricing?canceled=true')
    })

    expect(data.sessionId).toBe('cs_test_123')
    expect(data.url).toBe('https://checkout.stripe.com/pay/cs_test_123')
  })

  it('should handle errors gracefully', async () => {
    ;(stripe.checkout.sessions.create as jest.Mock).mockRejectedValueOnce(
      new Error('Stripe error')
    )

    const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({
        priceId: 'invalid_price',
        userId: 'user_123'
      })
    })

    const response = await stripeCheckout(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBeDefined()
  })
})