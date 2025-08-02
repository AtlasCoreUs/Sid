'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useAppStore } from '@/store/useAppStore'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { Building2, User, Mail, Phone, Globe, ArrowRight } from 'lucide-react'

interface FormData {
  businessName: string
  ownerName: string
  email: string
  phone: string
  website?: string
  description: string
}

const StepBusinessInfo: React.FC = () => {
  const { updateGeneratorData, setGeneratorStep, generatorData } = useAppStore()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: generatorData.businessInfo || {}
  })

  const onSubmit = (data: FormData) => {
    updateGeneratorData({ businessInfo: data })
    setGeneratorStep(2)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">
          Parlons de <span className="holographic-text">votre business</span>
        </h1>
        <p className="text-xl text-gray-400">
          Ces informations apparaîtront sur votre app personnalisée
        </p>
      </motion.div>

      <GlassCard variant="elevated" className="max-w-2xl mx-auto p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom de votre business
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('businessName', { required: 'Ce champ est requis' })}
                className="glass-input pl-12 w-full"
                placeholder="Restaurant Sophie, Dr. Martin Kiné..."
              />
            </div>
            {errors.businessName && (
              <p className="text-red-400 text-sm mt-1">{errors.businessName.message}</p>
            )}
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Votre nom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('ownerName', { required: 'Ce champ est requis' })}
                className="glass-input pl-12 w-full"
                placeholder="Sophie Dubois"
              />
            </div>
            {errors.ownerName && (
              <p className="text-red-400 text-sm mt-1">{errors.ownerName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email professionnel
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('email', { 
                  required: 'Ce champ est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email invalide'
                  }
                })}
                type="email"
                className="glass-input pl-12 w-full"
                placeholder="contact@monbusiness.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('phone', { required: 'Ce champ est requis' })}
                className="glass-input pl-12 w-full"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Website (optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Site web actuel (optionnel)
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('website')}
                className="glass-input pl-12 w-full"
                placeholder="https://monsite.com"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Décrivez votre activité
            </label>
            <textarea
              {...register('description', { required: 'Ce champ est requis' })}
              className="glass-input w-full"
              rows={4}
              placeholder="Restaurant gastronomique spécialisé dans la cuisine française moderne..."
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* AI Assistant Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-primary/10 border border-primary/20 rounded-xl p-4"
          >
            <p className="text-sm">
              💡 <strong>Astuce SID:</strong> Plus vous donnez de détails, plus votre app sera personnalisée et pertinente pour vos clients!
            </p>
          </motion.div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <GlassButton
              type="submit"
              variant="neon"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Continuer
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}

export default StepBusinessInfo