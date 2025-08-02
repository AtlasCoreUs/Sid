'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnimatedCalloutProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  dismissible?: boolean
  onDismiss?: () => void
  autoHide?: number
  position?: 'top' | 'bottom' | 'center'
  animation?: 'slide' | 'fade' | 'scale' | 'bounce'
}

const AnimatedCallout: React.FC<AnimatedCalloutProps> = ({
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss,
  autoHide,
  position = 'top',
  animation = 'slide',
}) => {
  const [isVisible, setIsVisible] = useState(true)

  React.useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, autoHide)
      return () => clearTimeout(timer)
    }
  }, [autoHide])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss?.()
    }, 300)
  }

  const icons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  }

  const colors = {
    info: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
    success: 'border-green-500/20 bg-green-500/10 text-green-400',
    warning: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
    error: 'border-red-500/20 bg-red-500/10 text-red-400',
  }

  const glowColors = {
    info: 'shadow-blue-500/20',
    success: 'shadow-green-500/20',
    warning: 'shadow-yellow-500/20',
    error: 'shadow-red-500/20',
  }

  const animationVariants = {
    slide: {
      initial: position === 'top' ? { y: -100, opacity: 0 } : { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: position === 'top' ? { y: -100, opacity: 0 } : { y: 100, opacity: 0 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
    },
    bounce: {
      initial: { scale: 0, opacity: 0 },
      animate: { 
        scale: 1, 
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 15,
        }
      },
      exit: { scale: 0, opacity: 0 },
    },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed z-50',
            position === 'top' && 'top-4 left-1/2 -translate-x-1/2',
            position === 'bottom' && 'bottom-4 left-1/2 -translate-x-1/2',
            position === 'center' && 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          )}
          {...animationVariants[animation]}
          transition={{ duration: 0.3 }}
        >
          <div
            className={cn(
              'relative overflow-hidden rounded-2xl border p-4 pr-12',
              'backdrop-blur-md shadow-2xl',
              colors[type],
              glowColors[type],
              'min-w-[320px] max-w-md'
            )}
          >
            {/* Background animation */}
            <motion.div
              className="absolute inset-0 -z-10"
              animate={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Icon */}
            <motion.div
              className="absolute left-4 top-4"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {icons[type]}
            </motion.div>

            {/* Content */}
            <div className="ml-8">
              <h4 className="font-semibold mb-1">{title}</h4>
              <p className="text-sm opacity-90">{message}</p>
            </div>

            {/* Dismiss button */}
            {dismissible && (
              <motion.button
                className="absolute right-2 top-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={handleDismiss}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}

            {/* Progress bar for autoHide */}
            {autoHide && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-white/30"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoHide / 1000, ease: 'linear' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedCallout