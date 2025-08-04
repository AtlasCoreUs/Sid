'use client'

import { useScrollProgress } from '@/hooks/useScrollProgress'

const ScrollProgress = () => {
  const progress = useScrollProgress()
  return (
    <div
      className="fixed top-0 left-0 h-1 bg-[#FF5EDB] z-50"
      style={{ width: `${progress * 100}%` }}
    />
  )
}

export default ScrollProgress
