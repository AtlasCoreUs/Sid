import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SID HUD - Business Card 2.0',
  description: 'Créez votre app personnalisée en quelques minutes. La révolution des cartes de visite digitales.',
  keywords: ['app generator', 'business card', 'AI', 'PWA', 'digital transformation'],
  authors: [{ name: 'Atlas Core' }],
  openGraph: {
    title: 'SID HUD - Votre Business Card du 21e Siècle',
    description: 'Stop les cartes, créez VOTRE app',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}