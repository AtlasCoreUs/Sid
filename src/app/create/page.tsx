'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppGeneratorWizard from '@/components/generator/AppGeneratorWizard'
import { useAppStore } from '@/store/useAppStore'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import GlassButton from '@/components/ui/GlassButton'

export default function CreatePage() {
  const { generatorStep } = useAppStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <GlassButton variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Retour
              </GlassButton>
            </Link>
            
            {/* Progress Bar */}
            <div className="flex-1 max-w-md mx-auto">
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(generatorStep / 5) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <p className="text-center text-sm text-gray-400 mt-2">
                Étape {generatorStep} sur 5
              </p>
            </div>

            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={generatorStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <AppGeneratorWizard />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Help Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <button className="glass-card p-4 rounded-full shadow-2xl hover:shadow-neon-blue transition-shadow">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </motion.div>
    </div>
  )
}