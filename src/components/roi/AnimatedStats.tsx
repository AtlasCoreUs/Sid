'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerChildren } from '@/animations'

const stats = [
  { label: 'ROI +2000%', value: '2000%' },
  { label: '48H Setup', value: '48H' },
  { label: '100% IA', value: '100%' },
]

const AnimatedStats = () => (
  <section className="py-20 bg-black text-white">
    <motion.div
      className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={fadeUp}>
          <div className="text-4xl font-bold text-[#00F0FF]">{stat.value}</div>
          <p className="mt-2 text-sm uppercase tracking-widest text-[#E0E0E0]">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  </section>
)

export default AnimatedStats
