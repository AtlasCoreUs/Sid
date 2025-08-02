'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { 
  ArrowLeft,
  Check,
  Sparkles,
  Rocket,
  Building2,
  Palette,
  Layers,
  Eye,
  Edit,
  Globe,
  Smartphone,
  Download
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const StepReview: React.FC = () => {
  const router = useRouter()
  const { generatorData, setGeneratorStep, resetGenerator } = useAppStore()
  const [isPublishing, setIsPublishing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    
    try {
      // Simuler la création de l'app (remplacer par API réelle)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setShowSuccess(true)
      toast.success('Votre app a été créée avec succès ! 🎉')
      
      // Rediriger vers le dashboard après 3 secondes
      setTimeout(() => {
        resetGenerator()
        router.push('/dashboard')
      }, 3000)
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
      setIsPublishing(false)
    }
  }

  const handleBack = () => {
    setGeneratorStep(4)
  }

  const handleEdit = (step: number) => {
    setGeneratorStep(step)
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="inline-flex p-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-8"
        >
          <Check className="w-16 h-16 text-green-500" />
        </motion.div>
        
        <h1 className="text-4xl font-bold mb-4">
          Félicitations ! 🎉
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Votre app <span className="text-primary font-semibold">
            {generatorData.businessInfo?.businessName}
          </span> est en ligne !
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GlassButton
            variant="neon"
            size="lg"
            icon={<Eye className="w-5 h-5" />}
          >
            Voir mon app
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="lg"
            icon={<Globe className="w-5 h-5" />}
          >
            Partager
          </GlassButton>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">
          Prêt à <span className="holographic-text">lancer</span> ?
        </h1>
        <p className="text-xl text-gray-400">
          Vérifiez une dernière fois avant de publier votre app
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Business Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Informations
              </h3>
              <button
                onClick={() => handleEdit(1)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Nom</p>
                <p className="font-medium">{generatorData.businessInfo?.businessName}</p>
              </div>
              <div>
                <p className="text-gray-400">Contact</p>
                <p className="font-medium">{generatorData.businessInfo?.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Téléphone</p>
                <p className="font-medium">{generatorData.businessInfo?.phone}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Template & Design Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5 text-secondary" />
                Design
              </h3>
              <button
                onClick={() => handleEdit(3)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Template</p>
                <p className="font-medium capitalize">{generatorData.template}</p>
              </div>
              <div>
                <p className="text-gray-400">Couleurs</p>
                <div className="flex gap-2 mt-1">
                  <div 
                    className="w-8 h-8 rounded-lg border border-white/20"
                    style={{ backgroundColor: generatorData.customization?.primaryColor }}
                  />
                  <div 
                    className="w-8 h-8 rounded-lg border border-white/20"
                    style={{ backgroundColor: generatorData.customization?.secondaryColor }}
                  />
                  <div 
                    className="w-8 h-8 rounded-lg border border-white/20"
                    style={{ backgroundColor: generatorData.customization?.accentColor }}
                  />
                </div>
              </div>
              <div>
                <p className="text-gray-400">Typographie</p>
                <p className="font-medium capitalize">{generatorData.customization?.fontStyle}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Features Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent" />
                Fonctionnalités
              </h3>
              <button
                onClick={() => handleEdit(4)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm">
              <p className="text-gray-400 mb-2">
                {generatorData.features?.length || 0} fonctionnalités actives
              </p>
              <div className="flex flex-wrap gap-2">
                {generatorData.features?.slice(0, 5).map((feature) => (
                  <span 
                    key={feature}
                    className="text-xs px-2 py-1 rounded-full bg-white/10"
                  >
                    {feature}
                  </span>
                ))}
                {generatorData.features && generatorData.features.length > 5 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                    +{generatorData.features.length - 5}
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* App Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <GlassCard className="p-8">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Aperçu de votre app
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mobile Preview */}
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4 flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4" />
                Version mobile
              </p>
              <div className="mx-auto w-64 h-[400px] bg-gray-900 rounded-[2rem] p-4 border border-white/10">
                <div className="h-full bg-gray-800 rounded-[1.5rem] overflow-hidden">
                  <div 
                    className="h-16 flex items-center px-4"
                    style={{ backgroundColor: generatorData.customization?.primaryColor }}
                  >
                    <div className="text-white font-semibold">
                      {generatorData.businessInfo?.businessName}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-32 bg-gray-700 rounded-lg animate-pulse" />
                    <div className="h-20 bg-gray-700 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">
                QR Code de votre app
              </p>
              <div className="mx-auto w-48 h-48 bg-white rounded-2xl p-4 flex items-center justify-center">
                <div className="w-full h-full bg-gray-900 rounded-lg" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Scannez pour accéder à votre app
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Domain Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <GlassCard className="p-6 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold">Votre app sera accessible à :</p>
              <p className="text-primary">
                https://{generatorData.businessInfo?.businessName?.toLowerCase().replace(/\s+/g, '-')}.sid-app.com
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <GlassButton
          variant="ghost"
          onClick={handleBack}
          icon={<ArrowLeft className="w-5 h-5" />}
          disabled={isPublishing}
        >
          Retour
        </GlassButton>

        <div className="flex gap-4">
          <GlassButton
            variant="secondary"
            icon={<Download className="w-5 h-5" />}
            disabled={isPublishing}
          >
            Sauvegarder
          </GlassButton>
          
          <GlassButton
            variant="neon"
            size="lg"
            onClick={handlePublish}
            disabled={isPublishing}
            icon={isPublishing ? undefined : <Rocket className="w-5 h-5" />}
          >
            {isPublishing ? (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span>Publication en cours...</span>
              </motion.div>
            ) : (
              'Publier mon app'
            )}
          </GlassButton>
        </div>
      </div>
    </div>
  )
}

export default StepReview