'use client'

import React from 'react'
import { useSubscription } from '@/hooks/useSubscription'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { Crown, Check, X, Calendar, CreditCard } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function SubscriptionStatus() {
  const { subscription, isLoading } = useSubscription()

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-32 mb-4" />
          <div className="h-6 bg-white/10 rounded w-48" />
        </div>
      </GlassCard>
    )
  }

  if (!subscription) return null

  const getPlanColor = () => {
    switch (subscription.plan) {
      case 'enterprise':
        return 'from-yellow-500 to-orange-500'
      case 'pro':
        return 'from-primary to-secondary'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getFeaturesList = () => {
    const { features } = subscription
    return [
      {
        label: 'Applications',
        value: features.maxApps === -1 ? 'Illimitées' : `${features.maxApps} max`,
        available: true,
      },
      {
        label: 'Visiteurs/mois',
        value: features.maxVisitors === -1 ? 'Illimités' : features.maxVisitors.toLocaleString(),
        available: true,
      },
      {
        label: 'Domaine personnalisé',
        value: features.customDomain ? 'Disponible' : 'Non disponible',
        available: features.customDomain,
      },
      {
        label: 'Analytics',
        value: features.analytics === 'realtime' ? 'Temps réel' : 
               features.analytics === 'advanced' ? 'Avancés' : 'Basiques',
        available: true,
      },
      {
        label: 'API',
        value: features.api ? 'Accès complet' : 'Non disponible',
        available: features.api,
      },
      {
        label: 'White-label',
        value: features.whiteLabel ? 'Disponible' : 'Non disponible',
        available: features.whiteLabel,
      },
    ]
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Mon abonnement</h3>
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${getPlanColor()} text-white text-sm font-medium`}>
              {subscription.plan === 'enterprise' && <Crown className="w-4 h-4" />}
              {subscription.plan.toUpperCase()}
            </div>
            {subscription.status === 'active' ? (
              <span className="text-xs text-green-500">Actif</span>
            ) : (
              <span className="text-xs text-gray-400">Inactif</span>
            )}
          </div>
        </div>

        <Link href="/pricing">
          <GlassButton variant="ghost" size="sm">
            Changer de plan
          </GlassButton>
        </Link>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {getFeaturesList().map((feature, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{feature.label}</span>
            <div className="flex items-center gap-2">
              <span className={feature.available ? '' : 'text-gray-500'}>
                {feature.value}
              </span>
              {feature.available ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Billing info */}
      {subscription.plan !== 'free' && subscription.currentPeriodEnd && (
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Prochain paiement</span>
            </div>
            <span>{formatDate(subscription.currentPeriodEnd.toString())}</span>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="mt-3 p-3 bg-red-500/10 rounded-lg text-sm text-red-500">
              Votre abonnement sera annulé le {formatDate(subscription.currentPeriodEnd.toString())}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <GlassButton variant="ghost" size="sm" icon={<CreditCard className="w-4 h-4" />}>
              Gérer le paiement
            </GlassButton>
            {!subscription.cancelAtPeriodEnd && (
              <GlassButton variant="ghost" size="sm" className="text-red-500 hover:text-red-400">
                Annuler l'abonnement
              </GlassButton>
            )}
          </div>
        </div>
      )}

      {/* Upgrade CTA for free plan */}
      {subscription.plan === 'free' && (
        <div className="pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-4">
            Débloquez plus de fonctionnalités avec un plan Pro ou Enterprise
          </p>
          <Link href="/pricing">
            <GlassButton variant="neon" size="sm" className="w-full" icon={<Crown className="w-4 h-4" />}>
              Passer au Pro
            </GlassButton>
          </Link>
        </div>
      )}
    </GlassCard>
  )
}