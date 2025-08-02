'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { 
  Check,
  X,
  Sparkles,
  Rocket,
  Crown,
  ArrowRight,
  Zap,
  Shield,
  Infinity,
  HeadphonesIcon,
  Globe,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Plan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  description: string
  features: string[]
  limitations: string[]
  recommended?: boolean
  icon: React.ReactNode
  color: string
  stripeProductId?: string
  stripePriceId?: string
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    currency: '€',
    interval: 'gratuit',
    description: 'Parfait pour découvrir et tester',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-gray-500 to-gray-600',
    features: [
      '1 application',
      'Templates de base',
      '100 visiteurs/mois',
      'Sous-domaine sid-app.com',
      'SSL gratuit',
      'Support communautaire',
    ],
    limitations: [
      'Pas de domaine personnalisé',
      'Analytics limités',
      'Pas d\'API',
      'Filigrane SID',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    currency: '€',
    interval: '/mois',
    description: 'Pour les professionnels ambitieux',
    icon: <Rocket className="w-6 h-6" />,
    color: 'from-primary to-secondary',
    recommended: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    features: [
      '5 applications',
      'Tous les templates',
      '10 000 visiteurs/mois',
      'Domaine personnalisé',
      'Analytics complets',
      'API REST',
      'Support prioritaire',
      'Suppression filigrane',
      'Sauvegarde automatique',
      'Éditeur avancé',
    ],
    limitations: [
      'Pas de white-label',
      'Limité à 5 apps',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    currency: '€',
    interval: '/mois',
    description: 'Solution complète sans limites',
    icon: <Crown className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Applications illimitées',
      'Tous les templates + custom',
      'Visiteurs illimités',
      'Domaines illimités',
      'Analytics temps réel',
      'API avancée + webhooks',
      'Support dédié 24/7',
      'White-label complet',
      'Formation équipe',
      'SLA 99.9%',
      'Développement sur mesure',
    ],
    limitations: [],
  },
]

export default function PricingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')

  const handleSubscribe = async (plan: Plan) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (plan.id === 'free') {
      router.push('/dashboard')
      return
    }

    setIsLoading(plan.id)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          planId: plan.id,
        }),
      })

      if (!response.ok) throw new Error('Erreur checkout')

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error('Erreur lors de la création du checkout')
      setIsLoading(null)
    }
  }

  const getPrice = (plan: Plan) => {
    if (plan.price === 0) return 'Gratuit'
    
    const price = billingInterval === 'yearly' 
      ? Math.floor(plan.price * 10) // 2 mois gratuits
      : plan.price

    return (
      <>
        <span className="text-4xl font-bold">{price}{plan.currency}</span>
        <span className="text-gray-400">
          {billingInterval === 'yearly' ? '/an' : plan.interval}
        </span>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              SID HUD
            </Link>
            
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <GlassButton variant="ghost">
                    Dashboard
                  </GlassButton>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <GlassButton variant="ghost">
                    Se connecter
                  </GlassButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choisissez votre <span className="holographic-text">plan</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Commencez gratuitement et évoluez selon vos besoins. 
            Changez de plan à tout moment.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={billingInterval === 'monthly' ? 'text-white' : 'text-gray-400'}>
              Mensuel
            </span>
            <button
              onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-white/10 rounded-full p-1 transition-colors"
            >
              <motion.div
                className="w-6 h-6 bg-primary rounded-full"
                animate={{ x: billingInterval === 'yearly' ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </button>
            <span className={billingInterval === 'yearly' ? 'text-white' : 'text-gray-400'}>
              Annuel
              <span className="text-green-500 text-sm ml-2">-17%</span>
            </span>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={plan.recommended ? 'scale-105' : ''}
            >
              <GlassCard 
                className={`p-8 h-full flex flex-col relative ${
                  plan.recommended ? 'border-primary' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Recommandé
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="text-3xl">
                    {getPrice(plan)}
                  </div>
                  {billingInterval === 'yearly' && plan.price > 0 && (
                    <p className="text-sm text-green-500 mt-2">
                      Économisez {Math.floor(plan.price * 2)}€ par an
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex-1 mb-8">
                  <h4 className="text-sm font-semibold text-gray-400 mb-4">INCLUS</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="text-sm font-semibold text-gray-400 mb-4 mt-6">LIMITATIONS</h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <X className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-400">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <GlassButton
                  variant={plan.recommended ? 'neon' : 'secondary'}
                  className="w-full"
                  onClick={() => handleSubscribe(plan)}
                  disabled={isLoading === plan.id}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  {isLoading === plan.id ? (
                    <motion.div
                      className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    plan.id === 'free' ? 'Commencer gratuitement' : 'Choisir ce plan'
                  )}
                </GlassButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Comparaison détaillée
          </h2>

          <GlassCard className="p-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4">Fonctionnalités</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                          {React.cloneElement(plan.icon as React.ReactElement, { className: 'w-5 h-5' })}
                        </div>
                        <span className="font-semibold">{plan.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Applications', values: ['1', '5', 'Illimitées'] },
                  { feature: 'Visiteurs mensuels', values: ['100', '10 000', 'Illimités'] },
                  { feature: 'Domaine personnalisé', values: [false, true, true] },
                  { feature: 'Analytics', values: ['Basiques', 'Complets', 'Temps réel'] },
                  { feature: 'Support', values: ['Communauté', 'Prioritaire', '24/7 dédié'] },
                  { feature: 'API', values: [false, true, 'Avancée'] },
                  { feature: 'White-label', values: [false, false, true] },
                  { feature: 'Sauvegardes', values: ['Manuelles', 'Auto', 'Auto + versioning'] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-4 text-gray-400">{row.feature}</td>
                    {row.values.map((value, j) => (
                      <td key={j} className="text-center py-4 px-4">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-500 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'Puis-je changer de plan à tout moment ?',
                a: 'Oui ! Vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont appliqués immédiatement.',
              },
              {
                q: 'Y a-t-il des frais cachés ?',
                a: 'Non, tous nos prix sont transparents. Pas de frais de setup, pas de commissions sur vos ventes.',
              },
              {
                q: 'Puis-je annuler mon abonnement ?',
                a: 'Oui, vous pouvez annuler à tout moment. Votre accès reste actif jusqu\'à la fin de la période payée.',
              },
              {
                q: 'Proposez-vous des réductions ?',
                a: 'Oui ! -17% sur les plans annuels, et des réductions spéciales pour les étudiants et ONGs.',
              },
            ].map((faq, i) => (
              <GlassCard key={i} className="p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-400">{faq.a}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Setup instantané</span>
            </div>
            <div className="flex items-center gap-2">
              <HeadphonesIcon className="w-5 h-5" />
              <span className="text-sm">Support réactif</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="text-sm">CDN mondial</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}