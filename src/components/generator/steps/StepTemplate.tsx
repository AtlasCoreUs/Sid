'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { 
  ArrowRight, 
  ArrowLeft,
  Utensils,
  Heart,
  Palette,
  Dumbbell,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Music,
  Camera,
  Code,
  Coffee,
  Car
} from 'lucide-react'

const templates = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Menu interactif, réservations, galerie photos',
    icon: Utensils,
    color: 'from-orange-500 to-red-500',
    features: ['Menu digital', 'Réservations', 'Avis clients', 'Galerie', 'Livraison'],
    popular: true,
  },
  {
    id: 'health',
    name: 'Santé & Bien-être',
    description: 'Prise de RDV, conseils, suivi patient',
    icon: Heart,
    color: 'from-blue-500 to-teal-500',
    features: ['Prise de RDV', 'Fiches conseils', 'Urgences', 'Téléconsultation'],
  },
  {
    id: 'creative',
    name: 'Créatif & Design',
    description: 'Portfolio, devis instantanés, projets',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    features: ['Portfolio', 'Devis en ligne', 'Chat client', 'Témoignages'],
  },
  {
    id: 'fitness',
    name: 'Sport & Fitness',
    description: 'Programmes, réservations cours, suivi',
    icon: Dumbbell,
    color: 'from-green-500 to-emerald-500',
    features: ['Planning cours', 'Programmes', 'Suivi progress', 'Communauté'],
  },
  {
    id: 'business',
    name: 'Business & Services',
    description: 'Présentation services, devis, contact',
    icon: Briefcase,
    color: 'from-gray-500 to-gray-700',
    features: ['Services', 'Devis', 'Témoignages', 'Blog', 'Contact'],
  },
  {
    id: 'education',
    name: 'Éducation',
    description: 'Cours en ligne, ressources, quiz',
    icon: GraduationCap,
    color: 'from-indigo-500 to-blue-500',
    features: ['Cours', 'Exercices', 'Vidéos', 'Certificats', 'Forum'],
  },
  {
    id: 'retail',
    name: 'Commerce',
    description: 'Catalogue produits, panier, paiement',
    icon: ShoppingBag,
    color: 'from-yellow-500 to-orange-500',
    features: ['Catalogue', 'Panier', 'Paiement', 'Suivi commande', 'Fidélité'],
  },
  {
    id: 'music',
    name: 'Musique & Arts',
    description: 'Streaming, événements, billetterie',
    icon: Music,
    color: 'from-pink-500 to-purple-500',
    features: ['Streaming', 'Événements', 'Billetterie', 'Fan club', 'Merch'],
  },
  {
    id: 'photography',
    name: 'Photographie',
    description: 'Galeries, booking, boutique prints',
    icon: Camera,
    color: 'from-cyan-500 to-blue-500',
    features: ['Galeries', 'Booking', 'Boutique', 'Blog', 'Workshops'],
  },
  {
    id: 'tech',
    name: 'Tech & Startup',
    description: 'Landing page, démo produit, blog',
    icon: Code,
    color: 'from-blue-600 to-purple-600',
    features: ['Landing', 'Démo', 'Pricing', 'Blog', 'API docs'],
  },
  {
    id: 'cafe',
    name: 'Café & Bar',
    description: 'Menu, événements, réservations table',
    icon: Coffee,
    color: 'from-amber-600 to-brown-600',
    features: ['Menu', 'Happy hours', 'Événements', 'Réservations', 'Fidélité'],
  },
  {
    id: 'auto',
    name: 'Automobile',
    description: 'Services, RDV atelier, devis',
    icon: Car,
    color: 'from-slate-600 to-slate-800',
    features: ['Services', 'RDV atelier', 'Devis', 'Véhicules occasion', 'Contact'],
  },
]

const StepTemplate: React.FC = () => {
  const { updateGeneratorData, setGeneratorStep, generatorData } = useAppStore()
  const [selectedTemplate, setSelectedTemplate] = useState(generatorData.template || '')
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const handleNext = () => {
    if (selectedTemplate) {
      updateGeneratorData({ template: selectedTemplate })
      setGeneratorStep(3)
    }
  }

  const handleBack = () => {
    setGeneratorStep(1)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">
          Choisissez votre <span className="holographic-text">template</span>
        </h1>
        <p className="text-xl text-gray-400">
          Des designs professionnels adaptés à votre métier
        </p>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onHoverStart={() => setHoveredTemplate(template.id)}
            onHoverEnd={() => setHoveredTemplate(null)}
          >
            <GlassCard
              variant={selectedTemplate === template.id ? 'neon' : 'interactive'}
              className={`relative p-6 cursor-pointer transition-all duration-300 ${
                selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {/* Popular Badge */}
              {template.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold"
                >
                  Populaire
                </motion.div>
              )}

              {/* Icon */}
              <motion.div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${template.color} mb-4`}
                animate={{
                  rotate: hoveredTemplate === template.id ? 360 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <template.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{template.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {template.features.slice(0, 3).map((feature, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10"
                  >
                    {feature}
                  </span>
                ))}
                {template.features.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    +{template.features.length - 3}
                  </span>
                )}
              </div>

              {/* Selected Indicator */}
              <motion.div
                initial={false}
                animate={{
                  scale: selectedTemplate === template.id ? 1 : 0,
                  opacity: selectedTemplate === template.id ? 1 : 0,
                }}
                className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* AI Suggestion */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <GlassCard className="p-6 bg-primary/10 border-primary/20">
            <p className="text-sm">
              💡 <strong>Suggestion SID:</strong> Le template "{templates.find(t => t.id === selectedTemplate)?.name}" 
              est parfait pour votre activité ! Il inclut toutes les fonctionnalités essentielles 
              et peut être personnalisé à 100% dans l'étape suivante.
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center max-w-2xl mx-auto">
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
          disabled={!selectedTemplate}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Continuer
        </GlassButton>
      </div>
    </div>
  )
}

export default StepTemplate