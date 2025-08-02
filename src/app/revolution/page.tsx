'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { REVOLUTION_MANIFESTO } from '@/lib/marketing/revolution-manifesto'
import { 
  CreditCard, 
  Smartphone, 
  TrendingUp, 
  Clock, 
  Shield,
  Star,
  Zap,
  ArrowRight,
  Check,
  X
} from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function RevolutionPage() {
  const [hoveredTransformation, setHoveredTransformation] = useState<number | null>(null)

  const triggerRevolutionConfetti = () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444']
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section Révolutionnaire */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
          
          {/* Animated Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 25, repeat: Infinity }}
          />
        </div>

        <div className="text-center max-w-6xl mx-auto z-10">
          {/* Headline Choc */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                BUSINESS CARDS
              </span>
              <br />
              <span className="text-white line-through opacity-50">ARE DEAD</span>
            </h1>
            
            <p className="text-3xl md:text-5xl font-bold text-white mb-8">
              Dis maintenant{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600 animate-pulse">
                "CHECK MON APP!"
              </span>
            </p>
          </motion.div>

          {/* Transformation Visuelle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {/* Avant */}
            <div className="relative">
              <GlassCard className="p-8 border-red-500/30 bg-red-900/10">
                <h3 className="text-2xl font-bold mb-4 text-red-400">❌ AVANT</h3>
                <div className="space-y-3">
                  {REVOLUTION_MANIFESTO.vision.avant_sid.problemes.map((problem, i) => (
                    <motion.p
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="text-gray-400"
                    >
                      {problem}
                    </motion.p>
                  ))}
                </div>
                <div className="absolute -top-4 -right-4 text-6xl opacity-20">😴</div>
              </GlassCard>
            </div>

            {/* Après */}
            <div className="relative">
              <GlassCard className="p-8 border-green-500/30 bg-green-900/10">
                <h3 className="text-2xl font-bold mb-4 text-green-400">✅ APRÈS</h3>
                <div className="space-y-3">
                  {REVOLUTION_MANIFESTO.vision.apres_sid.transformation.map((transform, i) => (
                    <motion.p
                      key={i}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="text-white font-medium"
                    >
                      {transform}
                    </motion.p>
                  ))}
                </div>
                <div className="absolute -top-4 -right-4 text-6xl opacity-50">🔥</div>
              </GlassCard>
            </div>
          </motion.div>

          {/* CTA Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <GlassButton
              variant="neon"
              size="lg"
              className="text-xl px-12 py-6"
              onClick={() => {
                triggerRevolutionConfetti()
                setTimeout(() => window.location.href = '/create', 500)
              }}
            >
              <Zap className="w-6 h-6 mr-2" />
              CRÉE TON APP EN 15 MIN
            </GlassButton>
            
            <p className="text-gray-400 mt-4">
              Rejoins les{' '}
              <span className="text-primary font-bold">10,000+ pros</span>{' '}
              qui ont déjà leur app
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section Impact Sociétal */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
                50 MILLIONS
              </span>
              <br />
              <span className="text-white">DE FUTURS APP CREATORS</span>
            </h2>
            
            {/* Phrases Choc */}
            <div className="space-y-4">
              {REVOLUTION_MANIFESTO.vision.impact_societal.phrases_choc.map((phrase, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-xl md:text-2xl text-gray-300"
                >
                  {phrase}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Restaurant (Storytelling) */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
              <span className="text-white">L'HISTOIRE DE </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                MARC
              </span>
            </h2>

            {/* Timeline du Lundi Matin */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500 to-green-500" />
              
              {/* Crisis */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <GlassCard className="p-8 max-w-2xl">
                  <h3 className="text-2xl font-bold text-red-400 mb-4">
                    😱 8h30 - LE CHAOS
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Nouveau cuisinier brûle 3 plats → -150€</li>
                    <li>• Client allergique noix → PANIQUE TOTALE</li>
                    <li>• Marc malade 2 jours → Restaurant en FEU</li>
                  </ul>
                  <p className="text-xl font-bold text-white mt-4">
                    "IL FAUT QUE ÇA CHANGE!"
                  </p>
                </GlassCard>
              </motion.div>

              {/* Discovery */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-16 ml-auto"
              >
                <GlassCard className="p-8 max-w-2xl">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                    🔍 14h00 - LA DÉCOUVERTE
                  </h3>
                  <p className="text-gray-300">
                    Marc cherche "app gestion restaurant" sur Google...<br />
                    Tombe sur une pub Facebook SID HUD...<br />
                    <span className="text-white font-bold">
                      "App restaurant en 15 min? Impossible..."
                    </span>
                  </p>
                </GlassCard>
              </motion.div>

              {/* Transformation */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <GlassCard className="p-8 max-w-2xl border-green-500/50">
                  <h3 className="text-2xl font-bold text-green-400 mb-4">
                    ⚡ 14h15 - LA RÉVOLUTION
                  </h3>
                  <p className="text-xl text-white font-bold mb-4">
                    15 MINUTES PLUS TARD...
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ App "Chez Marc" créée et personnalisée</li>
                    <li>✅ Toutes les recettes digitalisées</li>
                    <li>✅ Équipe formée instantanément</li>
                    <li>✅ QR codes imprimés</li>
                  </ul>
                </GlassCard>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mx-auto max-w-4xl"
              >
                <GlassCard className="p-12 text-center border-primary/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                  <h3 className="text-3xl font-bold text-white mb-8">
                    💰 RÉSULTATS PREMIER MOIS
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-5xl font-black text-green-400">5,900€</p>
                      <p className="text-gray-400">ÉCONOMISÉS</p>
                    </div>
                    <div>
                      <p className="text-5xl font-black text-primary">+40%</p>
                      <p className="text-gray-400">DE PROFITS</p>
                    </div>
                  </div>
                  <p className="text-xl text-white italic">
                    "J'aurais dû faire ça il y a 10 ans!"
                  </p>
                  <p className="text-gray-400">- Marc, maintenant APP CREATOR</p>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Offre Irrésistible */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                L'OFFRE LA PLUS FOLLE
              </span>
            </h2>
            <p className="text-2xl text-gray-300">
              qu'on ait jamais vue dans le game
            </p>
          </motion.div>

          {/* Stack de Valeur */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-primary">
                  ✅ CE QU'ON FAIT POUR TOI
                </h3>
                <div className="space-y-4">
                  {REVOLUTION_MANIFESTO.promesses.pour_restaurants.offre_irresistible.inclus.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-300">{item.replace('✅ ', '')}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 border-yellow-500/30">
                <h3 className="text-2xl font-bold mb-6 text-yellow-400">
                  💰 GARANTIES DE OUF
                </h3>
                <div className="space-y-4">
                  {REVOLUTION_MANIFESTO.promesses.pour_restaurants.offre_irresistible.garanties.map((garantie, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                      <span className="text-white font-medium">{garantie.replace(/[💰📈⏱️🛡️]/g, '')}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Pricing Psychologique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <GlassCard className="p-12 max-w-4xl mx-auto border-primary/50 bg-gradient-to-br from-purple-900/30 to-pink-900/30">
              <div className="mb-8">
                <p className="text-gray-400 line-through text-2xl">
                  Agence web : 10,000€ + 3 mois d'attente
                </p>
                <p className="text-6xl font-black text-white my-4">
                  SID HUD : <span className="text-primary">299€</span> + 15 minutes
                </p>
                <p className="text-3xl text-green-400 font-bold">
                  Tu économises 9,701€ 🤯
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <p className="text-gray-400 line-through">Normal</p>
                  <p className="text-2xl font-bold text-gray-500">599€</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-400">Early Bird</p>
                  <p className="text-3xl font-bold text-white">299€</p>
                  <p className="text-sm text-gray-400">(First 1000)</p>
                </div>
                <div className="text-center">
                  <p className="text-red-400 animate-pulse">TODAY ONLY</p>
                  <p className="text-4xl font-black text-primary">199€</p>
                  <p className="text-sm text-gray-400">⏰ Expire dans 24h</p>
                </div>
              </div>

              <GlassButton
                variant="neon"
                size="lg"
                className="text-2xl px-16 py-8 animate-pulse"
                onClick={() => {
                  triggerRevolutionConfetti()
                  setTimeout(() => window.location.href = '/create', 500)
                }}
              >
                🚀 JE VEUX MON APP MAINTENANT
              </GlassButton>

              <p className="text-gray-400 mt-4">
                🔥 17 personnes regardent cette page en ce moment
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            <span className="text-white">Le futur appartient aux </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              APP CREATORS
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-12">
            Sois <span className="text-primary font-bold">PIONNIER</span> ou sois{' '}
            <span className="text-red-400 font-bold">EN RETARD</span>
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {REVOLUTION_MANIFESTO.cta_variants.map((cta, i) => (
              <GlassButton
                key={i}
                variant={i === 0 ? 'neon' : 'secondary'}
                size="lg"
                className="text-lg"
                onClick={() => window.location.href = '/create'}
              >
                {cta.bouton}
              </GlassButton>
            ))}
          </div>

          <p className="text-gray-500 mt-16 text-lg italic">
            "Dans 5 ans, ne pas avoir d'app sera aussi bizarre<br />
            que ne pas avoir de téléphone aujourd'hui."
          </p>
        </motion.div>
      </section>
    </div>
  )
}