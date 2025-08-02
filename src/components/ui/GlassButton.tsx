'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'neon' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-glass-primary border-primary/20 text-white hover:bg-primary/20',
    secondary: 'bg-glass-secondary border-secondary/20 text-white hover:bg-secondary/20',
    neon: 'neon-button text-neon-blue',
    ghost: 'bg-transparent border-white/10 text-white hover:bg-white/5',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      className={cn(
        'glass-button relative flex items-center justify-center gap-2 font-medium',
        variants[variant],
        sizes[size],
        isLoading && 'cursor-not-allowed opacity-70',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.div
          className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
      
      {/* Liquid effect overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <motion.div
          className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            filter: 'blur(20px)',
          }}
        />
      </div>
    </motion.button>
  )
}

export default GlassButton