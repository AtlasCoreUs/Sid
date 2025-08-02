'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import GlassCard from '@/components/ui/GlassCard'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface GlassChartProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie'
  title: string
  data: any
  options?: any
  height?: number
}

const GlassChart: React.FC<GlassChartProps> = ({
  type,
  title,
  data,
  options = {},
  height = 300,
}) => {
  const chartRef = useRef<ChartJS>(null)

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#9CA3AF',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#9CA3AF',
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      },
    },
    scales: type === 'line' || type === 'bar' ? {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
    } : {},
  }

  const chartOptions = {
    ...defaultOptions,
    ...options,
  }

  // Add gradient to datasets
  useEffect(() => {
    if (chartRef.current && (type === 'line' || type === 'bar')) {
      const chart = chartRef.current
      const ctx = chart.ctx
      
      if (data.datasets) {
        data.datasets.forEach((dataset: any, index: number) => {
          const gradient = ctx.createLinearGradient(0, 0, 0, height)
          const colors = [
            ['rgba(99, 102, 241, 0.8)', 'rgba(99, 102, 241, 0.1)'],
            ['rgba(168, 85, 247, 0.8)', 'rgba(168, 85, 247, 0.1)'],
            ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.1)'],
          ]
          const [start, end] = colors[index % colors.length]
          gradient.addColorStop(0, start)
          gradient.addColorStop(1, end)
          
          if (type === 'line') {
            dataset.backgroundColor = gradient
            dataset.borderColor = start
            dataset.borderWidth = 2
            dataset.tension = 0.4
            dataset.fill = true
            dataset.pointBackgroundColor = start
            dataset.pointBorderColor = '#fff'
            dataset.pointBorderWidth = 2
            dataset.pointRadius = 4
            dataset.pointHoverRadius = 6
          } else if (type === 'bar') {
            dataset.backgroundColor = gradient
            dataset.borderColor = start
            dataset.borderWidth = 0
            dataset.borderRadius = 8
            dataset.borderSkipped = false
          }
        })
      }
    }
  }, [data, type, height])

  return (
    <GlassCard variant="elevated" className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-6">{title}</h3>
        
        <div style={{ height: `${height}px` }}>
          <Chart
            ref={chartRef}
            type={type}
            data={data}
            options={chartOptions}
          />
        </div>
      </motion.div>

      {/* Glow Effect */}
      <div className="absolute inset-0 -z-10 opacity-50 blur-3xl">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary/20 to-transparent" />
      </div>
    </GlassCard>
  )
}

export default GlassChart