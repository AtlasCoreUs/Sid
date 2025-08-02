'use client'

import React from 'react'
import { motion } from 'framer-motion'
import GlassButton from '@/components/ui/GlassButton'
import GlassCard from '@/components/ui/GlassCard'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesGrid from '@/components/sections/FeaturesGrid'
import AppShowcase from '@/components/sections/AppShowcase'
import { Sparkles, Rocket, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Grid */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="holographic-text">Révolutionnez</span> votre présence digitale
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Plus qu'une carte de visite, créez une expérience interactive complète
            </p>
          </motion.div>

          <FeaturesGrid />
        </div>
      </section>

      {/* App Showcase */}
      <section className="relative py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Des apps qui <span className="glow-text text-neon-pink">impressionnent</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Découvrez ce que nos utilisateurs ont créé avec SID
            </p>
          </motion.div>

          <AppShowcase />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <GlassCard variant="elevated" className="max-w-4xl mx-auto text-center p-12">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-flex p-4 rounded-full bg-primary/20 mb-8"
            >
              <Rocket className="w-12 h-12 text-primary" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à créer votre app ?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Rejoignez la révolution et créez votre Business Card 2.0 en quelques minutes
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <GlassButton
                variant="neon"
                size="lg"
                icon={<Sparkles className="w-5 h-5" />}
              >
                Commencer Gratuitement
              </GlassButton>
              <GlassButton
                variant="ghost"
                size="lg"
                icon={<Zap className="w-5 h-5" />}
              >
                Voir une démo
              </GlassButton>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-gray-400">Apps créées</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-secondary mb-2">98%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-accent mb-2">15min</div>
                <div className="text-sm text-gray-400">Temps moyen</div>
              </motion.div>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  )
}