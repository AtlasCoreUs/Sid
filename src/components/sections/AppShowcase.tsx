'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react'

const showcaseApps = [
  {
    id: 1,
    name: "Sophie Restaurant",
    category: "Restaurant",
    description: "Menu interactif, réservations en ligne, galerie photos immersive",
    image: "/showcase/restaurant.jpg",
    gradient: "from-orange-500 to-red-500",
    stats: {
      visitors: "2.5K/mois",
      rating: 4.9,
      creationTime: "12 min"
    },
    testimonial: "J'ai remplacé toutes mes cartes de visite. Les clients adorent pouvoir réserver directement!"
  },
  {
    id: 2,
    name: "Dr. Martin Kiné",
    category: "Santé",
    description: "Prise de RDV, exercices vidéo, suivi patient intégré",
    image: "/showcase/health.jpg",
    gradient: "from-blue-500 to-teal-500",
    stats: {
      visitors: "1.8K/mois",
      rating: 5.0,
      creationTime: "18 min"
    },
    testimonial: "Mes patients peuvent accéder à leurs exercices 24/7. Game changer!"
  },
  {
    id: 3,
    name: "Studio Créatif",
    category: "Design",
    description: "Portfolio dynamique, devis instantanés, chat client",
    image: "/showcase/design.jpg",
    gradient: "from-purple-500 to-pink-500",
    stats: {
      visitors: "3.2K/mois",
      rating: 4.8,
      creationTime: "15 min"
    },
    testimonial: "30% de nouveaux clients grâce à mon app. Meilleur investissement!"
  },
  {
    id: 4,
    name: "Coach Sarah",
    category: "Sport",
    description: "Programmes personnalisés, tracking progress, communauté",
    image: "/showcase/fitness.jpg",
    gradient: "from-green-500 to-emerald-500",
    stats: {
      visitors: "4.1K/mois",
      rating: 4.9,
      creationTime: "20 min"
    },
    testimonial: "Mes clients restent motivés avec les notifications et le suivi intégré."
  }
]

const AppShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const navigate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === showcaseApps.length - 1 ? 0 : prevIndex + 1
      }
      return prevIndex === 0 ? showcaseApps.length - 1 : prevIndex - 1
    })
  }

  const currentApp = showcaseApps[currentIndex]

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* App Preview */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ 
                opacity: 0, 
                x: direction > 0 ? 100 : -100,
                scale: 0.9
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: direction > 0 ? -100 : 100,
                scale: 0.9
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                {/* Phone Mockup */}
                <div className="relative mx-auto w-72 h-[600px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] shadow-2xl" />
                  <div className="absolute inset-[3px] bg-black rounded-[2.8rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="h-6 bg-gray-900 flex items-center justify-between px-6 text-xs text-gray-400">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-3 bg-gray-400 rounded-sm" />
                        <div className="w-4 h-3 bg-gray-400 rounded-sm" />
                        <div className="w-4 h-3 bg-gray-400 rounded-sm" />
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
                      <div className={`h-40 rounded-2xl bg-gradient-to-br ${currentApp.gradient} mb-4 flex items-center justify-center`}>
                        <h3 className="text-2xl font-bold text-white">{currentApp.name}</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="h-20 bg-gray-800/50 rounded-xl animate-pulse" />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-24 bg-gray-800/50 rounded-xl animate-pulse" />
                          <div className="h-24 bg-gray-800/50 rounded-xl animate-pulse" />
                        </div>
                        <div className="h-32 bg-gray-800/50 rounded-xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-full" />
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 glass-card p-3"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{currentApp.stats.rating}</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 glass-card p-3"
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="text-sm">
                    <div className="text-gray-400">Créée en</div>
                    <div className="font-semibold">{currentApp.stats.creationTime}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* App Info */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass-light border border-white/10 text-sm mb-4">
                <span className="text-gray-400">{currentApp.category}</span>
              </div>

              <h3 className="text-3xl font-bold mb-4">{currentApp.name}</h3>
              <p className="text-xl text-gray-400 mb-6">{currentApp.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <GlassCard className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{currentApp.stats.visitors}</div>
                  <div className="text-sm text-gray-400">Visiteurs</div>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">{currentApp.stats.rating}</div>
                  <div className="text-sm text-gray-400">Note moyenne</div>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{currentApp.stats.creationTime}</div>
                  <div className="text-sm text-gray-400">Temps création</div>
                </GlassCard>
              </div>

              {/* Testimonial */}
              <GlassCard className="p-6 mb-8">
                <p className="text-lg italic mb-2">"{currentApp.testimonial}"</p>
                <p className="text-sm text-gray-400">- Créateur de {currentApp.name}</p>
              </GlassCard>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    icon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Précédent
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(1)}
                    icon={<ChevronRight className="w-4 h-4" />}
                  >
                    Suivant
                  </GlassButton>
                </div>

                <GlassButton
                  variant="primary"
                  size="sm"
                  icon={<ExternalLink className="w-4 h-4" />}
                >
                  Voir l'app live
                </GlassButton>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-8">
                {showcaseApps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1)
                      setCurrentIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-8 bg-primary' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AppShowcase