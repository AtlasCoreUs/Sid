'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'elevated' | 'interactive' | 'neon'
  blur?: 'light' | 'medium' | 'heavy'
  children: React.ReactNode
  hasParticles?: boolean
}

const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  blur = 'medium',
  children,
  hasParticles = false,
  className,
  ...props
}) => {
  const variants = {
    default: 'glass-card',
    elevated: 'glass-card shadow-2xl',
    interactive: 'glass-card hover:shadow-2xl transition-shadow duration-300',
    neon: 'glass-card border-neon-blue/50 shadow-neon-blue',
  }

  const blurLevels = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-xl',
  }

  return (
    <motion.div
      className={cn(
        variants[variant],
        blurLevels[blur],
        'relative overflow-hidden',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      {...props}
    >
      {/* Liquid Glass Background Effect */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -inset-10 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Particles Effect */}
      {hasParticles && (
        <div className="particle-container absolute inset-0 -z-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                x: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                ],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
              }}
            />
          ))}
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>

      {/* Glass Reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  )
}

export default GlassCard