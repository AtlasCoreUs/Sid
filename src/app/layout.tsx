import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import FloatingSidebar from '@/components/notes/FloatingSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SID HUD - Créez votre app en 15 minutes',
  description: 'Générateur d\'applications professionnelles avec IA. Transformez votre business en app moderne.',
  keywords: 'app generator, no-code, AI, business app, mobile app, PWA',
  authors: [{ name: 'SID HUD Team' }],
  openGraph: {
    title: 'SID HUD - La révolution des apps professionnelles',
    description: 'Créez votre app en 15 minutes. Sans coder. Avec l\'IA.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SID HUD - Créez votre app en 15 minutes',
    description: 'Le générateur d\'apps qui révolutionne le business',
    images: ['/og-image.png'],
  },
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
          <FloatingSidebar />
        </Providers>
      </body>
    </html>
  )
}