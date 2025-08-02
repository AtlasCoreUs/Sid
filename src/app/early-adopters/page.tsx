'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { 
  Zap, 
  Trophy, 
  Users, 
  Star, 
  Gift, 
  Shield,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { REAL_TEMPLATES } from '@/lib/templates/real-examples'
import ShareButton from '@/components/social/ShareButton'

export default function EarlyAdoptersPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  const [spotsLeft, setSpotsLeft] = useState(847) // 1000 - 153 déjà pris
  const [showBadgePreview, setShowBadgePreview] = useState(false)
  
  // Countdown timer
  useEffect(() => {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 7) // 7 jours
    
    const timer = setInterval(() => {
      const now = new Date()
      const difference = endDate.getTime() - now.getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // Simulate spots being taken
  useEffect(() => {
    const interval = setInterval(() => {
      if (spotsLeft > 0) {
        setSpotsLeft(prev => Math.max(0, prev - Math.floor(Math.random() * 3)))
      }
    }, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [spotsLeft])
  
  const handleJoinProgram = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#EC4899', '#10B981']
    })
  }
  
  const benefits = [
    {
      icon: Star,
      title: '-50% À VIE',
      description: '149€ au lieu de 299€, pour toujours',
      highlight: true
    },
    {
      icon: Award,
      title: 'Badge LinkedIn Exclusif',
      description: '"SID Pioneer 2024" - Montre ton avant-gardisme',
      highlight: true
    },
    {
      icon: Sparkles,
      title: 'Accès Features VIP',
      description: 'Nouvelles fonctionnalités 30 jours avant tout le monde'
    },
    {
      icon: Gift,
      title: '1 App Gratuite à Offrir',
      description: 'Parraine un ami et offre-lui son app'
    },
    {
      icon: Shield,
      title: 'Support VIP 24/7',
      description: 'Ligne directe avec l\'équipe fondatrice'
    },
    {
      icon: TrendingUp,
      title: 'Formation Exclusive',
      description: 'Masterclass "10x ton business avec l\'IA"'
    }
  ]
  
  const testimonials = [
    {
      name: 'Marc Dubois',
      business: 'Bistrot Chez Marc',
      quote: 'J\'ai sauté sur l\'offre early adopter. Meilleure décision business de ma vie!',
      savings: '+40% de profits'
    },
    {
      name: 'Sarah Martin',
      business: 'Sarah Coiffure',
      quote: 'Le badge LinkedIn impressionne mes clients. Je suis vue comme une pro tech!',
      savings: '+45% de CA'
    },
    {
      name: 'Thomas Leroy',
      business: 'Power Gym',
      quote: 'L\'accès VIP aux nouvelles features me donne toujours un coup d\'avance.',
      savings: '+65% rétention'
    }
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Urgency Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/40 rounded-full mb-8"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">
              Plus que {spotsLeft} places sur 1000 !
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              EARLY ADOPTERS
            </span>
            <br />
            <span className="text-white">PROGRAMME EXCLUSIF</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Sois parmi les 1000 premiers à révolutionner ton business
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-12"
          >
            {Object.entries(timeLeft).map(([unit, value]) => (
              <GlassCard key={unit} className="p-4 text-center">
                <div className="text-3xl md:text-5xl font-black text-white">
                  {String(value).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm text-gray-400 uppercase">
                  {unit === 'days' ? 'Jours' : 
                   unit === 'hours' ? 'Heures' :
                   unit === 'minutes' ? 'Minutes' : 'Secondes'}
                </div>
              </GlassCard>
            ))}
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/create">
              <GlassButton
                variant="neon"
                size="lg"
                onClick={handleJoinProgram}
                className="text-xl px-12 py-6"
              >
                <Zap className="w-6 h-6 mr-2" />
                REJOINDRE LE PROGRAMME (-50%)
              </GlassButton>
            </Link>
            
            <p className="text-gray-500 text-sm mt-4">
              Sans engagement • Annulation à tout moment
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-16"
          >
            <span className="text-white">Avantages </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
              EXCLUSIFS
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard 
                  className={`p-6 h-full ${
                    benefit.highlight ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      benefit.highlight 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                        : 'bg-white/10'
                    }`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LinkedIn Badge Preview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-white mb-4">
              Ton Badge LinkedIn Exclusif
            </h2>
            <p className="text-xl text-gray-400">
              Montre au monde que tu fais partie des pionniers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <GlassCard className="p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-30 blur-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    SID HUD Pioneer 2024
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Early Adopter • Top 1000 • Innovation Leader
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowBadgePreview(!showBadgePreview)}
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      Voir sur LinkedIn →
                    </button>
                    <ShareButton
                      title="Je suis SID Pioneer 2024!"
                      description="J'ai rejoint les 1000 premiers utilisateurs de SID HUD"
                      hashtags={['SIDPioneer', 'EarlyAdopter', 'Innovation']}
                      variant="icon"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-center text-white mb-16"
          >
            Ils ont déjà sauté le pas
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="mb-4">
                    <p className="text-lg italic text-gray-300 mb-4">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {testimonial.business}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-green-400">
                          {testimonial.savings}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-3xl p-12 border border-purple-500/30"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Plus que {spotsLeft} places !
            </h2>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-3xl font-black text-white line-through opacity-50">
                  299€
                </p>
                <p className="text-sm text-gray-500">Prix normal</p>
              </div>
              
              <div className="text-6xl">→</div>
              
              <div className="text-center">
                <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                  149€
                </p>
                <p className="text-sm text-green-400">À VIE</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Accès complet à toutes les fonctionnalités</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Badge LinkedIn "Pioneer 2024"</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Support VIP prioritaire</span>
              </div>
            </div>

            <Link href="/create">
              <GlassButton
                variant="neon"
                size="lg"
                onClick={handleJoinProgram}
                className="text-xl px-12 py-6"
              >
                <Users className="w-6 h-6 mr-2" />
                DEVENIR EARLY ADOPTER MAINTENANT
              </GlassButton>
            </Link>

            <p className="text-gray-500 text-sm mt-6">
              🔒 Paiement sécurisé • 💳 Annulation à tout moment • ✅ Satisfait ou remboursé 30j
            </p>
          </motion.div>
        </div>
      </section>

      {/* Live counter */}
      <motion.div
        className="fixed bottom-6 left-6 bg-black/90 backdrop-blur-xl rounded-lg p-4 border border-white/10"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <div>
            <p className="text-sm text-white font-semibold">
              {Math.floor(Math.random() * 50) + 10} personnes regardent
            </p>
            <p className="text-xs text-gray-400">
              Dernière inscription il y a {Math.floor(Math.random() * 10) + 1}min
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}