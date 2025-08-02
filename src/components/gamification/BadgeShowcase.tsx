'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import ShareButton from '@/components/social/ShareButton'
import {
  Trophy,
  Star,
  Zap,
  TrendingUp,
  Award,
  Users,
  Download,
  Share2
} from 'lucide-react'
import { calculateCreatorStatus, CREATOR_BADGES, generateCertificate } from '@/lib/gamification'
import confetti from 'canvas-confetti'

interface BadgeShowcaseProps {
  stats: {
    appsCreated: number
    appsPublished: number
    totalUsers: number
    revenue: number
  }
  onBadgeClick?: (badge: any) => void
}

export default function BadgeShowcase({ stats, onBadgeClick }: BadgeShowcaseProps) {
  const [showCertificate, setShowCertificate] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  
  const status = calculateCreatorStatus(stats)
  const earnedBadges = CREATOR_BADGES.filter(badge => 
    badge.criteria.type === 'apps_created' && stats.appsCreated >= badge.criteria.value
  )

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B']
    })
  }

  const handleBadgeUnlock = (badge: any) => {
    setSelectedBadge(badge)
    triggerConfetti()
    onBadgeClick?.(badge)
  }

  const downloadCertificate = () => {
    if (!selectedBadge) return
    
    const certificateHTML = generateCertificate(selectedBadge, 'Utilisateur')
    // Logique pour générer et télécharger le PDF
    console.log('Downloading certificate...')
  }

  return (
    <>
      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <GlassCard className="p-6 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-50" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-4xl">{status.badge}</span>
                  {status.title}
                </h2>
                <p className="text-gray-400 mt-1">
                  Niveau {status.level} • {stats.appsCreated} apps créées
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-400">Prochain niveau</p>
                <p className="font-semibold">{status.nextLevel?.title}</p>
              </div>
            </div>

            {/* Progress Bar */}
            {status.nextLevel && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{status.nextLevel.requirement}</span>
                  <span>{Math.round(status.nextLevel.progress)}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${status.nextLevel.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Current Perks */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                Tes avantages actuels
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {status.perks.slice(0, 4).map((perk, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {CREATOR_BADGES.map((badge, index) => {
          const isEarned = stats.appsCreated >= badge.criteria.value
          const isNext = !isEarned && (
            index === 0 || stats.appsCreated >= CREATOR_BADGES[index - 1].criteria.value
          )

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                className={`p-6 text-center cursor-pointer transition-all ${
                  isEarned 
                    ? 'border-primary/50 hover:border-primary' 
                    : isNext
                    ? 'border-yellow-500/30 hover:border-yellow-500/50'
                    : 'opacity-50 grayscale'
                }`}
                onClick={() => isEarned && handleBadgeUnlock(badge)}
              >
                <motion.div
                  className="text-6xl mb-3"
                  animate={isEarned ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {badge.icon}
                </motion.div>
                
                <h3 className="font-semibold text-sm mb-1">
                  {badge.name}
                </h3>
                
                <p className="text-xs text-gray-400">
                  {badge.criteria.value} apps
                </p>

                {isEarned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-3"
                  >
                    <span className="text-xs text-green-500 font-semibold">
                      ✓ DÉBLOQUÉ
                    </span>
                  </motion.div>
                )}

                {isNext && !isEarned && (
                  <div className="mt-3">
                    <span className="text-xs text-yellow-500 font-semibold">
                      🔓 PROCHAIN
                    </span>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{earnedBadges.length}</p>
              <p className="text-xs text-gray-400">Badges gagnés</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-xs text-gray-400">Utilisateurs total</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.revenue}€</p>
              <p className="text-xs text-gray-400">Revenue généré</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {status.level === 4 ? '∞' : CREATOR_BADGES[status.level]?.criteria.value - stats.appsCreated}
              </p>
              <p className="text-xs text-gray-400">Apps avant niveau sup</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Badge Details Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-6"
            >
              <GlassCard className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-8xl mb-6"
                >
                  {selectedBadge.icon}
                </motion.div>

                <h2 className="text-3xl font-bold mb-4">
                  {selectedBadge.name}
                </h2>

                <p className="text-lg text-gray-400 mb-6">
                  {selectedBadge.description}
                </p>

                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Récompenses débloquées:</h3>
                  <div className="space-y-2">
                    {selectedBadge.rewards.map((reward: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-left"
                      >
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{reward}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <GlassButton
                    variant="secondary"
                    icon={<Download className="w-4 h-4" />}
                    onClick={downloadCertificate}
                  >
                    Certificat
                  </GlassButton>

                  <ShareButton
                    title={`J'ai débloqué le badge ${selectedBadge.name} sur SID HUD !`}
                    description={selectedBadge.shareTemplates?.linkedin || ''}
                  />
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}