'use client'

import React from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import { 
  Sparkles, 
  Rocket, 
  Zap, 
  Shield, 
  Smartphone, 
  Globe,
  Brain,
  Palette,
  Users,
  BarChart3,
  MessageSquare,
  Layers
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: "100% Sans Code",
    description: "Créez votre app sans écrire une seule ligne de code. Interface drag & drop intuitive.",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5"
  },
  {
    icon: Rocket,
    title: "15 Minutes",
    description: "De l'idée à l'app publiée en moins de 15 minutes. Record battu : 8 minutes!",
    color: "text-secondary",
    gradient: "from-secondary/20 to-secondary/5"
  },
  {
    icon: Brain,
    title: "IA Intégrée",
    description: "Assistant SID qui apprend de vous et génère du contenu personnalisé automatiquement.",
    color: "text-accent",
    gradient: "from-accent/20 to-accent/5"
  },
  {
    icon: Smartphone,
    title: "Multi-Plateforme",
    description: "Une seule création, disponible partout : Web, iOS, Android, Desktop.",
    color: "text-neon-blue",
    gradient: "from-blue-500/20 to-blue-500/5"
  },
  {
    icon: Globe,
    title: "PWA Native",
    description: "Apps installables, notifications push, mode hors-ligne. Comme une vraie app!",
    color: "text-neon-green",
    gradient: "from-green-500/20 to-green-500/5"
  },
  {
    icon: Shield,
    title: "Sécurité Max",
    description: "Chiffrement de bout en bout, RGPD compliant, hébergement sécurisé.",
    color: "text-neon-purple",
    gradient: "from-purple-500/20 to-purple-500/5"
  },
  {
    icon: Palette,
    title: "Templates Pro",
    description: "Bibliothèque de templates premium pour chaque métier. Personnalisables à l'infini.",
    color: "text-neon-pink",
    gradient: "from-pink-500/20 to-pink-500/5"
  },
  {
    icon: BarChart3,
    title: "Analytics Intégrés",
    description: "Suivez vos visiteurs, conversions, et performances en temps réel.",
    color: "text-yellow-500",
    gradient: "from-yellow-500/20 to-yellow-500/5"
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Invitez votre équipe, gérez les permissions, travaillez ensemble.",
    color: "text-indigo-500",
    gradient: "from-indigo-500/20 to-indigo-500/5"
  },
  {
    icon: MessageSquare,
    title: "Chat Intégré",
    description: "Système de messagerie temps réel pour interagir avec vos visiteurs.",
    color: "text-teal-500",
    gradient: "from-teal-500/20 to-teal-500/5"
  },
  {
    icon: Layers,
    title: "Widgets Avancés",
    description: "Charts interactifs, call-outs animés, effets visuels spectaculaires.",
    color: "text-orange-500",
    gradient: "from-orange-500/20 to-orange-500/5"
  },
  {
    icon: Zap,
    title: "Performance Ultra",
    description: "Chargement < 1s, optimisation automatique, score Lighthouse > 95.",
    color: "text-red-500",
    gradient: "from-red-500/20 to-red-500/5"
  }
]

const FeaturesGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <GlassCard
            variant="interactive"
            className="h-full p-6 group hover:border-white/20 transition-all duration-300"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {feature.title}
            </h3>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              {feature.description}
            </p>

            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${feature.gradient.split(' ')[1].replace('to-', '')} 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}

export default FeaturesGrid