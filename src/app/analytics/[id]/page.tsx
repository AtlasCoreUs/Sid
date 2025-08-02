'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import GlassChart from '@/components/charts/GlassChart'
import StatsWidget from '@/components/widgets/StatsWidget'
import { 
  ArrowLeft,
  TrendingUp,
  Users,
  Eye,
  Clock,
  MousePointer,
  Globe,
  Activity,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface AnalyticsData {
  app: {
    id: string
    name: string
    slug: string
  }
  overview: {
    totalVisitors: number
    uniqueVisitors: number
    pageViews: number
    avgSessionTime: number
    bounceRate: number
    conversions: number
  }
  timeSeries: Array<{
    date: string
    visitors: number
    pageViews: number
    uniqueVisitors: number
  }>
  topPages: Array<{
    path: string
    views: number
    avgTime: number
  }>
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
  sources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
}

export default function AnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [params.id, dateRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/apps/${params.id}/analytics?range=${dateRange}`)
      if (!response.ok) throw new Error('Erreur analytics')
      
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
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

  if (!analytics) return null

  // Préparer les données pour les graphiques
  const visitorChartData = {
    labels: analytics.timeSeries.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Visiteurs',
        data: analytics.timeSeries.map(d => d.visitors),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
      },
      {
        label: 'Visiteurs uniques',
        data: analytics.timeSeries.map(d => d.uniqueVisitors),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      },
    ],
  }

  const pageViewsChartData = {
    labels: analytics.timeSeries.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Pages vues',
        data: analytics.timeSeries.map(d => d.pageViews),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
      },
    ],
  }

  const deviceChartData = {
    labels: ['Desktop', 'Mobile', 'Tablette'],
    datasets: [
      {
        data: [analytics.devices.desktop, analytics.devices.mobile, analytics.devices.tablet],
        backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B'],
      },
    ],
  }

  const sourcesChartData = {
    labels: analytics.sources.map(s => s.source),
    datasets: [
      {
        label: 'Visiteurs par source',
        data: analytics.sources.map(s => s.visitors),
        backgroundColor: [
          '#8B5CF6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#3B82F6',
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <GlassButton variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                  Retour
                </GlassButton>
              </Link>
              <h1 className="text-xl font-semibold">Analytics - {analytics.app.name}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="glass-input text-sm px-3 py-2"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">1 an</option>
              </select>
              
              <GlassButton
                variant="secondary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
              >
                Exporter
              </GlassButton>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatsWidget
            title="Visiteurs"
            value={analytics.overview.totalVisitors}
            icon={<Users className="w-4 h-4" />}
            color="primary"
            change={12}
          />
          <StatsWidget
            title="Visiteurs uniques"
            value={analytics.overview.uniqueVisitors}
            icon={<Activity className="w-4 h-4" />}
            color="secondary"
            change={8}
          />
          <StatsWidget
            title="Pages vues"
            value={analytics.overview.pageViews}
            icon={<Eye className="w-4 h-4" />}
            color="accent"
            change={15}
          />
          <StatsWidget
            title="Durée moyenne"
            value={`${Math.floor(analytics.overview.avgSessionTime / 60)}m`}
            icon={<Clock className="w-4 h-4" />}
            color="info"
            change={-5}
          />
          <StatsWidget
            title="Taux de rebond"
            value={`${analytics.overview.bounceRate}%`}
            icon={<MousePointer className="w-4 h-4" />}
            color="warning"
            change={-3}
          />
          <StatsWidget
            title="Conversions"
            value={analytics.overview.conversions}
            icon={<TrendingUp className="w-4 h-4" />}
            color="success"
            change={25}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Visitors Chart */}
          <GlassChart
            type="line"
            data={visitorChartData}
            title="Évolution des visiteurs"
            height={300}
          />

          {/* Page Views Chart */}
          <GlassChart
            type="bar"
            data={pageViewsChartData}
            title="Pages vues"
            height={300}
          />

          {/* Device Distribution */}
          <GlassChart
            type="doughnut"
            data={deviceChartData}
            title="Répartition par appareil"
            height={300}
          />

          {/* Traffic Sources */}
          <GlassChart
            type="pie"
            data={sourcesChartData}
            title="Sources de trafic"
            height={300}
          />
        </div>

        {/* Top Pages Table */}
        <GlassCard className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Pages les plus visitées
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Page</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Vues</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Temps moyen</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">% du total</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topPages.map((page, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{page.path}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className="text-sm font-semibold">{page.views.toLocaleString()}</span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className="text-sm">{Math.floor(page.avgTime / 60)}m {page.avgTime % 60}s</span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${(page.views / analytics.overview.pageViews) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">
                          {((page.views / analytics.overview.pageViews) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <h4 className="text-lg font-semibold mb-4">Meilleures heures</h4>
            <p className="text-sm text-gray-400 mb-4">
              Vos visiteurs sont plus actifs entre 18h et 21h
            </p>
            <div className="space-y-2">
              {[
                { hour: '18h-19h', percentage: 85 },
                { hour: '19h-20h', percentage: 100 },
                { hour: '20h-21h', percentage: 90 },
              ].map((item) => (
                <div key={item.hour} className="flex items-center gap-3">
                  <span className="text-sm w-20">{item.hour}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h4 className="text-lg font-semibold mb-4">Performances</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Temps de chargement moyen</p>
                <p className="text-2xl font-bold text-green-500">1.2s</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Score Lighthouse</p>
                <p className="text-2xl font-bold text-green-500">94/100</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Taux d'erreur</p>
                <p className="text-2xl font-bold text-yellow-500">0.3%</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h4 className="text-lg font-semibold mb-4">Recommandations</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <p className="text-sm">Optimiser les images pour améliorer le temps de chargement</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5" />
                <p className="text-sm">Ajouter plus de contenu sur la page d'accueil</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
                <p className="text-sm">Activer les notifications push pour l'engagement</p>
              </li>
            </ul>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}