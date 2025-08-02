'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { 
  ArrowRight, 
  ArrowLeft,
  MessageSquare,
  Calendar,
  ShoppingCart,
  Bell,
  MapPin,
  Star,
  Users,
  BarChart3,
  Lock,
  Mail,
  Phone,
  Share2,
  CreditCard,
  Image,
  Video,
  FileText,
  Search,
  Heart,
  Download
} from 'lucide-react'

interface Feature {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: 'essential' | 'engagement' | 'business' | 'advanced'
  popular?: boolean
  aiRecommended?: boolean
}

const features: Feature[] = [
  // Essential
  { id: 'contact', name: 'Formulaire de contact', description: 'Recevez des messages directement', icon: Mail, category: 'essential', popular: true },
  { id: 'phone', name: 'Click-to-call', description: 'Appel direct depuis l\'app', icon: Phone, category: 'essential' },
  { id: 'location', name: 'Localisation', description: 'Maps et directions intégrées', icon: MapPin, category: 'essential', popular: true },
  { id: 'gallery', name: 'Galerie photos', description: 'Showcase visuel de vos produits', icon: Image, category: 'essential' },
  
  // Engagement
  { id: 'chat', name: 'Chat en temps réel', description: 'Messagerie instantanée avec clients', icon: MessageSquare, category: 'engagement', aiRecommended: true },
  { id: 'booking', name: 'Réservations', description: 'Système de RDV intégré', icon: Calendar, category: 'engagement', popular: true },
  { id: 'reviews', name: 'Avis clients', description: 'Collectez et affichez les témoignages', icon: Star, category: 'engagement' },
  { id: 'notifications', name: 'Notifications push', description: 'Restez en contact avec vos clients', icon: Bell, category: 'engagement', aiRecommended: true },
  { id: 'loyalty', name: 'Programme fidélité', description: 'Récompensez vos meilleurs clients', icon: Heart, category: 'engagement' },
  { id: 'social', name: 'Partage social', description: 'Viralité sur les réseaux', icon: Share2, category: 'engagement' },
  
  // Business
  { id: 'shop', name: 'Boutique en ligne', description: 'Vendez vos produits/services', icon: ShoppingCart, category: 'business', popular: true },
  { id: 'payment', name: 'Paiement intégré', description: 'Acceptez cartes et wallets', icon: CreditCard, category: 'business' },
  { id: 'analytics', name: 'Analytics avancés', description: 'Suivez vos performances', icon: BarChart3, category: 'business', aiRecommended: true },
  { id: 'crm', name: 'Gestion clients', description: 'Base de données clients intégrée', icon: Users, category: 'business' },
  { id: 'blog', name: 'Blog/Actualités', description: 'Partagez votre expertise', icon: FileText, category: 'business' },
  
  // Advanced
  { id: 'video', name: 'Streaming vidéo', description: 'Hébergez vos vidéos', icon: Video, category: 'advanced' },
  { id: 'search', name: 'Recherche avancée', description: 'Trouvez rapidement l\'info', icon: Search, category: 'advanced' },
  { id: 'security', name: 'Espace membre sécurisé', description: 'Contenu exclusif protégé', icon: Lock, category: 'advanced' },
  { id: 'download', name: 'Téléchargements', description: 'Partagez des documents', icon: Download, category: 'advanced' },
]

const categories = [
  { id: 'essential', name: 'Essentiels', description: 'Les must-have pour démarrer' },
  { id: 'engagement', name: 'Engagement', description: 'Fidélisez vos visiteurs' },
  { id: 'business', name: 'Business', description: 'Développez votre activité' },
  { id: 'advanced', name: 'Avancées', description: 'Pour aller plus loin' },
]

const StepFeatures: React.FC = () => {
  const { updateGeneratorData, setGeneratorStep, generatorData } = useAppStore()
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    generatorData.features || ['contact', 'phone', 'location', 'gallery']
  )

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const selectAllInCategory = (category: string) => {
    const categoryFeatures = features.filter(f => f.category === category).map(f => f.id)
    setSelectedFeatures(prev => {
      const otherFeatures = prev.filter(id => !categoryFeatures.includes(id))
      const allSelected = categoryFeatures.every(id => prev.includes(id))
      
      if (allSelected) {
        return otherFeatures
      } else {
        return [...new Set([...otherFeatures, ...categoryFeatures])]
      }
    })
  }

  const handleNext = () => {
    updateGeneratorData({ features: selectedFeatures })
    setGeneratorStep(5)
  }

  const handleBack = () => {
    setGeneratorStep(3)
  }

  const getRecommendedFeatures = () => {
    // Based on template selected in step 2
    const template = generatorData.template
    if (template === 'restaurant') {
      return ['booking', 'reviews', 'gallery', 'location']
    } else if (template === 'health') {
      return ['booking', 'chat', 'notifications', 'security']
    }
    // Default recommendations
    return features.filter(f => f.aiRecommended).map(f => f.id)
  }

  const recommendedFeatures = getRecommendedFeatures()

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">
          Activez vos <span className="holographic-text">super-pouvoirs</span>
        </h1>
        <p className="text-xl text-gray-400">
          Sélectionnez les fonctionnalités pour votre app
        </p>
      </motion.div>

      {/* AI Recommendations */}
      {recommendedFeatures.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassCard className="p-6 bg-primary/10 border-primary/20">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              🤖 Recommandations SID pour votre template
            </h3>
            <div className="flex flex-wrap gap-2">
              {recommendedFeatures.map(id => {
                const feature = features.find(f => f.id === id)
                if (!feature) return null
                return (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFeature(id)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedFeatures.includes(id)
                        ? 'bg-primary text-white'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <feature.icon className="w-4 h-4 inline mr-1" />
                    {feature.name}
                  </motion.button>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Features by Category */}
      <div className="space-y-8 mb-12">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categories.indexOf(category) * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.description}</p>
              </div>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => selectAllInCategory(category.id)}
              >
                Tout sélectionner
              </GlassButton>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features
                .filter(f => f.category === category.id)
                .map((feature) => (
                  <motion.div
                    key={feature.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GlassCard
                      className={`p-4 cursor-pointer transition-all ${
                        selectedFeatures.includes(feature.id)
                          ? 'ring-2 ring-primary bg-primary/10'
                          : 'hover:bg-white/5'
                      }`}
                      onClick={() => toggleFeature(feature.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedFeatures.includes(feature.id)
                            ? 'bg-primary text-white'
                            : 'bg-white/10'
                        }`}>
                          <feature.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium flex items-center gap-2">
                            {feature.name}
                            {feature.popular && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500">
                                Populaire
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {feature.description}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedFeatures.includes(feature.id)
                            ? 'bg-primary border-primary'
                            : 'border-white/20'
                        }`}>
                          {selectedFeatures.includes(feature.id) && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Features Summary */}
      <GlassCard className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {selectedFeatures.length} fonctionnalités sélectionnées
            </h3>
            <p className="text-sm text-gray-400">
              Vous pourrez toujours en ajouter plus tard
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {selectedFeatures.length <= 5 ? 'Gratuit' : 'Pro'}
            </p>
            <p className="text-sm text-gray-400">
              {selectedFeatures.length <= 5 ? 'Plan Starter' : 'Upgrade requis'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <GlassButton
          variant="ghost"
          onClick={handleBack}
          icon={<ArrowLeft className="w-5 h-5" />}
        >
          Retour
        </GlassButton>

        <GlassButton
          variant="neon"
          size="lg"
          onClick={handleNext}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Continuer
        </GlassButton>
      </div>
    </div>
  )
}

export default StepFeatures