'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerChildren } from '@/animations'
import { useVoiceCommand } from '@/hooks/useVoiceCommand'
import ParticleField from '../effects/ParticleField'
import { hexToRgba } from '@/utils/colorUtils'

const Hero = () => {
  useVoiceCommand('atlas, crée mon pack roi', () => alert('Lancement du module SIGMA 🌀'))

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#110011] to-black text-center">
      <ParticleField />
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="p-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl shadow-2xl"
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF5EDB] to-[#00F0FF]"
        >
          PACK ROI TOTAL™
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-[#E0E0E0] max-w-xl mx-auto"
        >
          Interface futuriste holographique, activée par l’IA, conçue pour booster le ROI à l’infini.
        </motion.p>
        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          style={{ boxShadow: `0 0 20px ${hexToRgba('#00F0FF', 0.5)}` }}
          className="mt-10 px-8 py-3 text-lg font-bold text-black bg-[#00F0FF] rounded-full relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#FF5EDB] to-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative">GÉNÈRE MON PACK ROI</span>
        </motion.button>
      </motion.div>
    </section>
  )
}

export default Hero
