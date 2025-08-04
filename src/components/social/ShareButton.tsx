'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassButton from '@/components/ui/GlassButton'
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link,
  Mail,
  MessageCircle,
  Check,
  QrCode
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'

interface ShareButtonProps {
  url?: string
  title?: string
  description?: string
  hashtags?: string[]
  variant?: 'button' | 'icon'
  className?: string
}

export default function ShareButton({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Découvrez SID HUD - Créez des apps incroyables',
  description = 'Créez votre app professionnelle en 5 minutes avec l\'IA',
  hashtags = ['SIDHUD', 'AppGenerator', 'NoCode', 'AI'],
  variant = 'button',
  className
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  const generateQRCode = async () => {
    try {
      const qr = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      setQrCodeUrl(qr)
    } catch (err) {
      console.error('Erreur QR Code:', err)
    }
  }

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=${hashtags.join(',')}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: '#EA4335',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Lien copié !')
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      toast.error('Erreur lors de la copie')
    }
  }

  const handleShare = (shareUrl: string, platform: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400')
    
    // Track l'événement
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: platform,
        content_type: 'app',
        item_id: url,
      })
    }
  }

  React.useEffect(() => {
    if (isOpen && !qrCodeUrl) {
      generateQRCode()
    }
  }, [isOpen])

  return (
    <>
      {variant === 'button' ? (
        <GlassButton
          variant="secondary"
          icon={<Share2 className="w-4 h-4" />}
          onClick={() => setIsOpen(true)}
          className={className}
        >
          Partager
        </GlassButton>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "p-2 rounded-lg hover:bg-white/10 transition-all",
            className
          )}
        >
          <Share2 className="w-5 h-5" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6"
            >
              <div className="glass-card p-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Partager cette app</h3>
                  <p className="text-gray-400">
                    Partagez avec vos amis et gagnez des récompenses !
                  </p>
                </div>

                {/* Boutons de partage */}
                <div className="grid grid-cols-3 gap-3">
                  {shareLinks.map((link) => (
                    <motion.button
                      key={link.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare(link.url, link.name)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${link.color}20` }}
                      >
                        <link.icon
                          className="w-6 h-6"
                          style={{ color: link.color }}
                        />
                      </div>
                      <span className="text-xs">{link.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Copier le lien */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={url}
                      readOnly
                      className="flex-1 glass-input text-sm"
                    />
                    <GlassButton
                      variant={copied ? 'neon' : 'secondary'}
                      icon={copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                      onClick={copyToClipboard}
                    >
                      {copied ? 'Copié !' : 'Copier'}
                    </GlassButton>
                  </div>
                </div>

                {/* QR Code */}
                {qrCodeUrl && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-3">
                      Ou scannez ce QR code
                    </p>
                    <div className="inline-block p-4 bg-white rounded-2xl">
                      <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                    </div>
                  </div>
                )}

                {/* Message viral */}
                <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm">
                    🎁 <strong>Bonus !</strong> Chaque ami qui s'inscrit avec votre lien
                    vous rapporte <span className="text-primary font-bold">1 mois gratuit</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}