'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import GlassButton from '@/components/ui/GlassButton'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      </div>

      <div className="text-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none">
            <span className="holographic-text">404</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Page introuvable
          </h2>
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            La page que vous recherchez semble avoir disparu dans le cyberespace.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <GlassButton variant="neon" icon={<Home className="w-5 h-5" />}>
              Retour à l'accueil
            </GlassButton>
          </Link>
          <GlassButton
            variant="ghost"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => window.history.back()}
          >
            Page précédente
          </GlassButton>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-20"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🚀
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 text-6xl opacity-20"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          💫
        </motion.div>
      </div>
    </div>
  )
}