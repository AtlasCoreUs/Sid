'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { WifiOff, RefreshCcw, Smartphone } from 'lucide-react'
import GlassButton from '@/components/ui/GlassButton'

export default function OfflinePage() {
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    } else {
      alert('Vous êtes toujours hors ligne')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Icône animée */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex p-6 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-8"
        >
          <WifiOff className="w-16 h-16 text-orange-500" />
        </motion.div>

        <h1 className="text-4xl font-bold mb-4">
          Vous êtes <span className="text-orange-500">hors ligne</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-8">
          Pas de panique ! Vos données sont sauvegardées localement.
        </p>

        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-gray-300">
              ✅ Vos brouillons sont sauvegardés
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-gray-300">
              ✅ Vous pouvez continuer à naviguer dans l'app
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-gray-300">
              ✅ Tout sera synchronisé au retour de la connexion
            </p>
          </div>
        </div>

        <GlassButton
          variant="neon"
          size="lg"
          onClick={handleRetry}
          icon={<RefreshCcw className="w-5 h-5" />}
        >
          Réessayer
        </GlassButton>

        {/* Animation de particules */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}