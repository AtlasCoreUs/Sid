'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface StatsWidgetProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  suffix?: string
  prefix?: string
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  title,
  value,
  change,
  icon,
  color = 'primary',
  suffix,
  prefix,
}) => {
  const colorClasses = {
    primary: 'text-primary border-primary/20 bg-primary/10',
    secondary: 'text-secondary border-secondary/20 bg-secondary/10',
    accent: 'text-accent border-accent/20 bg-accent/10',
    success: 'text-green-500 border-green-500/20 bg-green-500/10',
    warning: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
    danger: 'text-red-500 border-red-500/20 bg-red-500/10',
  }

  const getTrendIcon = () => {
    if (change === undefined) return null
    if (change > 0) return <TrendingUp className="w-4 h-4" />
    if (change < 0) return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (change === undefined) return ''
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  return (
    <GlassCard variant="interactive" className="p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <motion.div
            className="flex items-baseline gap-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {prefix && <span className="text-2xl font-semibold">{prefix}</span>}
            <span className="text-3xl font-bold">{value}</span>
            {suffix && <span className="text-xl text-gray-400">{suffix}</span>}
          </motion.div>
        </div>
        
        {icon && (
          <motion.div
            className={cn(
              'p-3 rounded-xl border',
              colorClasses[color]
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {icon}
          </motion.div>
        )}
      </div>

      {change !== undefined && (
        <motion.div
          className={cn('flex items-center gap-1 text-sm', getTrendColor())}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getTrendIcon()}
          <span className="font-medium">
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-gray-400">vs mois dernier</span>
        </motion.div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={cn(
          'absolute inset-0 rounded-2xl blur-xl',
          color === 'primary' && 'bg-primary/20',
          color === 'secondary' && 'bg-secondary/20',
          color === 'accent' && 'bg-accent/20',
          color === 'success' && 'bg-green-500/20',
          color === 'warning' && 'bg-yellow-500/20',
          color === 'danger' && 'bg-red-500/20'
        )} />
      </div>
    </GlassCard>
  )
}

export default StatsWidget