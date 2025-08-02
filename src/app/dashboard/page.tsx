'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import StatsWidget from '@/components/widgets/StatsWidget'
import { useSubscription } from '@/hooks/useSubscription'
import { 
  Plus, 
  Eye, 
  Edit, 
  BarChart3, 
  Users, 
  TrendingUp,
  Smartphone,
  Globe,
  Settings,
  ExternalLink,
  MoreVertical,
  Crown
} from 'lucide-react'
import Link from 'next/link'

interface AppData {
  id: string
  name: string
  slug: string
  description: string
  template: string
  published: boolean
  createdAt: string
  settings: {
    primaryColor: string
    secondaryColor: string
  }
  analytics: Array<{
    visitors: number
    pageViews: number
    uniqueVisitors: number
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { subscription, canCreateApp, showUpgradePrompt } = useSubscription()
  const [apps, setApps] = useState<AppData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      const response = await fetch('/api/apps')
      if (response.ok) {
        const data = await response.json()
        setApps(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des apps:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalStats = () => {
    const totalVisitors = apps.reduce((sum, app) => 
      sum + (app.analytics[0]?.visitors || 0), 0
    )
    const totalPageViews = apps.reduce((sum, app) => 
      sum + (app.analytics[0]?.pageViews || 0), 0
    )
    return { totalVisitors, totalPageViews }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  const { totalVisitors, totalPageViews } = getTotalStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                <Smartphone className="w-8 h-8 text-primary" />
                SID HUD
              </Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Bonjour, {session?.user?.name || session?.user?.email}
              </span>
              {subscription && (
                <Link href="/pricing">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    subscription.plan === 'enterprise' 
                      ? 'bg-yellow-500/20 text-yellow-500' 
                      : subscription.plan === 'pro'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {subscription.plan === 'enterprise' && <Crown className="w-3 h-3 inline mr-1" />}
                    {subscription.plan.toUpperCase()}
                  </span>
                </Link>
              )}
              {canCreateApp(apps.length) ? (
                <Link href="/create">
                  <GlassButton variant="neon" icon={<Plus className="w-4 h-4" />}>
                    Nouvelle App
                  </GlassButton>
                </Link>
              ) : (
                <GlassButton 
                  variant="secondary" 
                  icon={<Crown className="w-4 h-4" />}
                  onClick={() => showUpgradePrompt('createApp')}
                >
                  Upgrade pour plus
                </GlassButton>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsWidget
            title="Total Apps"
            value={apps.length}
            icon={<Smartphone className="w-5 h-5" />}
            color="primary"
          />
          <StatsWidget
            title="Visiteurs Total"
            value={totalVisitors}
            icon={<Users className="w-5 h-5" />}
            color="secondary"
            suffix="/mois"
          />
          <StatsWidget
            title="Pages Vues"
            value={totalPageViews}
            icon={<Eye className="w-5 h-5" />}
            color="accent"
            change={15}
          />
          <StatsWidget
            title="Taux Conversion"
            value="3.2"
            icon={<TrendingUp className="w-5 h-5" />}
            color="success"
            suffix="%"
            change={8}
          />
        </div>

        {/* Apps Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Mes Applications</h2>
          
          {apps.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Smartphone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune app pour le moment</h3>
              <p className="text-gray-400 mb-6">
                Créez votre première app en quelques minutes
              </p>
              <Link href="/create">
                <GlassButton variant="neon" icon={<Plus className="w-5 h-5" />}>
                  Créer ma première app
                </GlassButton>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full flex flex-col">
                    {/* App Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ 
                          background: `linear-gradient(135deg, ${app.settings.primaryColor}, ${app.settings.secondaryColor})`
                        }}
                      >
                        {app.name.charAt(0).toUpperCase()}
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* App Info */}
                    <h3 className="text-xl font-semibold mb-1">{app.name}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {app.description}
                    </p>

                    {/* App Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {app.analytics[0]?.visitors || 0}
                        </p>
                        <p className="text-xs text-gray-400">Visiteurs</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-2xl font-bold text-secondary">
                          {app.analytics[0]?.pageViews || 0}
                        </p>
                        <p className="text-xs text-gray-400">Vues</p>
                      </div>
                    </div>

                    {/* App Actions */}
                    <div className="flex gap-2 mt-auto">
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        icon={<Eye className="w-4 h-4" />}
                      >
                        Voir
                      </GlassButton>
                      <Link href={`/editor/${app.id}`}>
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          icon={<Edit className="w-4 h-4" />}
                        >
                          Éditer
                        </GlassButton>
                      </Link>
                      <Link href={`/analytics/${app.id}`}>
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          icon={<BarChart3 className="w-4 h-4" />}
                        >
                          Stats
                        </GlassButton>
                      </Link>
                    </div>

                    {/* App URL */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <a 
                        href={`https://${app.slug}.sid-app.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        {app.slug}.sid-app.com
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}

              {/* Create New App Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: apps.length * 0.1 }}
              >
                <Link href="/create">
                  <GlassCard className="p-6 h-full min-h-[300px] flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Plus className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Créer une app</h3>
                    <p className="text-sm text-gray-400">
                      Lancez une nouvelle app en quelques minutes
                    </p>
                  </GlassCard>
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <Settings className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Paramètres du compte</h3>
            <p className="text-sm text-gray-400 mb-4">
              Gérez vos informations et préférences
            </p>
            <GlassButton variant="ghost" size="sm">
              Accéder
            </GlassButton>
          </GlassCard>

          <GlassCard className="p-6">
            <BarChart3 className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics avancés</h3>
            <p className="text-sm text-gray-400 mb-4">
              Analyse détaillée de toutes vos apps
            </p>
            <GlassButton variant="ghost" size="sm">
              Voir plus
            </GlassButton>
          </GlassCard>

          <GlassCard className="p-6">
            <Users className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-semibold mb-2">Support & Aide</h3>
            <p className="text-sm text-gray-400 mb-4">
              Documentation et assistance 24/7
            </p>
            <GlassButton variant="ghost" size="sm">
              Obtenir de l'aide
            </GlassButton>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}