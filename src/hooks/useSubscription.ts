'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface SubscriptionData {
  plan: string
  status: string
  currentPeriodEnd?: Date
  cancelAtPeriodEnd?: boolean
  features: {
    maxApps: number
    maxVisitors: number
    customDomain: boolean
    analytics: string
    api: boolean
    whiteLabel: boolean
  }
}

export function useSubscription() {
  const { data: session } = useSession()

  const { data: subscription, isLoading, error } = useQuery<SubscriptionData>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await fetch('/api/stripe/checkout')
      if (!response.ok) throw new Error('Erreur récupération abonnement')
      return response.json()
    },
    enabled: !!session,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const checkLimit = (limitType: keyof SubscriptionData['features'], currentCount?: number): boolean => {
    if (!subscription) return false

    switch (limitType) {
      case 'maxApps':
        if (subscription.features.maxApps === -1) return true
        return (currentCount || 0) < subscription.features.maxApps
      
      case 'maxVisitors':
        if (subscription.features.maxVisitors === -1) return true
        return (currentCount || 0) < subscription.features.maxVisitors
      
      default:
        return subscription.features[limitType] === true
    }
  }

  const requiresPro = (feature: string): boolean => {
    if (!subscription) return true
    return subscription.plan === 'free' && ['customDomain', 'api', 'advancedAnalytics'].includes(feature)
  }

  const requiresEnterprise = (feature: string): boolean => {
    if (!subscription) return true
    return ['whiteLabel', 'unlimitedApps', 'realtimeAnalytics'].includes(feature) && 
           subscription.plan !== 'enterprise'
  }

  const showUpgradePrompt = (feature: string) => {
    let message = 'Cette fonctionnalité nécessite un plan supérieur.'
    let plan = 'pro'

    if (requiresEnterprise(feature)) {
      message = 'Cette fonctionnalité est réservée au plan Enterprise.'
      plan = 'enterprise'
    }

    toast.error(message, {
      duration: 5000,
      action: {
        label: 'Upgrade',
        onClick: () => window.location.href = '/pricing',
      },
    })
  }

  return {
    subscription,
    isLoading,
    error,
    checkLimit,
    requiresPro,
    requiresEnterprise,
    showUpgradePrompt,
    isPro: subscription?.plan === 'pro' || subscription?.plan === 'enterprise',
    isEnterprise: subscription?.plan === 'enterprise',
    canCreateApp: (currentAppCount: number) => checkLimit('maxApps', currentAppCount),
    canUseCustomDomain: () => checkLimit('customDomain'),
    canUseAPI: () => checkLimit('api'),
    canUseWhiteLabel: () => checkLimit('whiteLabel'),
  }
}