'use client'

import { motion } from 'framer-motion'
import { fadeUp, tilt3D } from '@/animations'
import React from 'react'

const modules = [
  'Audience Holographique',
  'Stratégies Multicanal',
  'Automation IA',
]

const ModulesSelector: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const circle = document.createElement('span')
    const diameter = Math.max(target.clientWidth, target.clientHeight)
    const radius = diameter / 2
    circle.style.width = circle.style.height = `${diameter}px`
    circle.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`
    circle.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`
    circle.classList.add('ripple')
    const ripple = target.getElementsByClassName('ripple')[0]
    if (ripple) ripple.remove()
    target.appendChild(circle)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#110011] text-white">
      <h2 className="text-center text-3xl font-bold mb-10">7 Modules Stratégiques</h2>
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((m) => (
          <motion.div
            key={m}
            variants={fadeUp}
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="relative p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 cursor-pointer overflow-hidden"
            onClick={handleClick}
          >
            <motion.div variants={tilt3D} className="h-full flex items-center justify-center">
              <span>{m}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background: rgba(255,255,255,0.3);
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}

export default ModulesSelector
