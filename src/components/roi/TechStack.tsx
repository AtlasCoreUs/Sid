'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerChildren } from '@/animations'

const icons = [
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', alt: 'Next.js' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', alt: 'TailwindCSS' },
  { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', alt: 'Framer Motion' },
]

const TechStack = () => (
  <section className="py-20 bg-black text-white">
    <h2 className="text-center text-3xl font-bold mb-10">Stack Technologique</h2>
    <motion.div
      className="flex justify-center gap-10"
      variants={staggerChildren}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {icons.map((icon) => (
        <motion.img
          key={icon.alt}
          variants={fadeUp}
          src={icon.src}
          alt={icon.alt}
          className="h-12 w-12"
        />
      ))}
    </motion.div>
  </section>
)

export default TechStack
