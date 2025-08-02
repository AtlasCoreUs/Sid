// Monitoring & Error Tracking Setup
// Pour production : intégrer Sentry, LogRocket ou similaire

interface ErrorLog {
  message: string
  stack?: string
  componentStack?: string
  timestamp: Date
  userAgent: string
  url: string
  userId?: string
}

class MonitoringService {
  private static instance: MonitoringService
  private errors: ErrorLog[] = []

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  // Log des erreurs
  logError(error: Error, errorInfo?: any) {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    }

    this.errors.push(errorLog)

    // En production : envoyer à Sentry
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error)
      console.error('Production error:', errorLog)
    } else {
      console.error('Development error:', errorLog)
    }
  }

  // Tracking des performances
  trackPerformance(metric: string, value: number) {
    // En production : envoyer à Google Analytics ou autre
    if (process.env.NODE_ENV === 'production') {
      // gtag('event', 'timing_complete', { name: metric, value })
    }
    console.log(`Performance metric: ${metric} = ${value}ms`)
  }

  // Tracking des événements utilisateur
  trackEvent(category: string, action: string, label?: string, value?: number) {
    // En production : envoyer à Google Analytics
    if (process.env.NODE_ENV === 'production') {
      // gtag('event', action, { event_category: category, event_label: label, value })
    }
    console.log(`Event: ${category} - ${action}`, { label, value })
  }

  // Monitoring de l'uptime API
  async checkAPIHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }
}

export const monitoring = MonitoringService.getInstance()

// Hook pour tracking automatique des pages vues
export function usePageTracking() {
  if (typeof window !== 'undefined') {
    monitoring.trackEvent('page_view', window.location.pathname)
  }
}

// Performance Observer pour Core Web Vitals
if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
  // LCP (Largest Contentful Paint)
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    monitoring.trackPerformance('LCP', lastEntry.startTime)
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // FID (First Input Delay)
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry: any) => {
      monitoring.trackPerformance('FID', entry.processingStart - entry.startTime)
    })
  }).observe({ entryTypes: ['first-input'] })

  // CLS (Cumulative Layout Shift)
  let clsValue = 0
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
        monitoring.trackPerformance('CLS', clsValue * 1000)
      }
    })
  }).observe({ entryTypes: ['layout-shift'] })
}