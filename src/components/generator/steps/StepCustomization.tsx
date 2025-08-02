'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Palette,
  Type,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  RefreshCw
} from 'lucide-react'

interface CustomizationData {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontStyle: 'modern' | 'classic' | 'playful' | 'elegant'
  logo?: string
  backgroundImage?: string
}

const colorPresets = [
  { name: 'Ocean', primary: '#0EA5E9', secondary: '#7C3AED', accent: '#10B981' },
  { name: 'Sunset', primary: '#F97316', secondary: '#EC4899', accent: '#F59E0B' },
  { name: 'Forest', primary: '#10B981', secondary: '#059669', accent: '#84CC16' },
  { name: 'Royal', primary: '#6366F1', secondary: '#8B5CF6', accent: '#3B82F6' },
  { name: 'Candy', primary: '#EC4899', secondary: '#F472B6', accent: '#A78BFA' },
  { name: 'Night', primary: '#1E293B', secondary: '#334155', accent: '#6366F1' },
]

const fontStyles = [
  { id: 'modern', name: 'Moderne', font: 'Inter', preview: 'Aa' },
  { id: 'classic', name: 'Classique', font: 'Georgia', preview: 'Aa' },
  { id: 'playful', name: 'Ludique', font: 'Comic Sans MS', preview: 'Aa' },
  { id: 'elegant', name: 'Élégant', font: 'Playfair Display', preview: 'Aa' },
]

const StepCustomization: React.FC = () => {
  const { updateGeneratorData, setGeneratorStep, generatorData } = useAppStore()
  const [customization, setCustomization] = useState<CustomizationData>({
    primaryColor: generatorData.customization?.primaryColor || '#6366F1',
    secondaryColor: generatorData.customization?.secondaryColor || '#8B5CF6',
    accentColor: generatorData.customization?.accentColor || '#3B82F6',
    fontStyle: generatorData.customization?.fontStyle || 'modern',
    logo: generatorData.customization?.logo,
    backgroundImage: generatorData.customization?.backgroundImage,
  })
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile')

  const handleColorChange = (colorType: keyof CustomizationData, color: string) => {
    setCustomization(prev => ({ ...prev, [colorType]: color }))
  }

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    setCustomization(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    }))
  }

  const handleNext = () => {
    updateGeneratorData({ customization })
    setGeneratorStep(4)
  }

  const handleBack = () => {
    setGeneratorStep(2)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Customization Panel */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-4">
            Personnalisez votre <span className="holographic-text">design</span>
          </h1>
          <p className="text-lg text-gray-400">
            Créez une identité visuelle unique pour votre app
          </p>
        </motion.div>

        {/* Colors Section */}
        <GlassCard className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Couleurs
          </h3>

          {/* Color Presets */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">Palettes prédéfinies</p>
            <div className="grid grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePresetSelect(preset)}
                  className="glass-card p-3 text-center"
                >
                  <div className="flex justify-center gap-1 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className="text-xs">{preset.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Couleur principale</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={customization.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-16 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="glass-input flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Couleur secondaire</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={customization.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-16 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="glass-input flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Couleur d'accent</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={customization.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-16 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={customization.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="glass-input flex-1"
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Typography Section */}
        <GlassCard className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Type className="w-5 h-5 text-primary" />
            Typographie
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {fontStyles.map((style) => (
              <motion.button
                key={style.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCustomization(prev => ({ ...prev, fontStyle: style.id as any }))}
                className={`glass-card p-4 text-center ${
                  customization.fontStyle === style.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div 
                  className="text-3xl mb-2" 
                  style={{ fontFamily: style.font }}
                >
                  {style.preview}
                </div>
                <span className="text-sm">{style.name}</span>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        {/* Logo & Images */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Logo & Images
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Logo</label>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-8 text-center cursor-pointer border-2 border-dashed border-white/20"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">
                  Cliquez ou glissez votre logo ici
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, SVG (max. 5MB)
                </p>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Preview Panel */}
      <div className="sticky top-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Aperçu en direct</h3>
          <div className="flex gap-2">
            <GlassButton
              variant={previewDevice === 'mobile' ? 'primary' : 'ghost'}
              size="sm"
              icon={<Smartphone className="w-4 h-4" />}
              onClick={() => setPreviewDevice('mobile')}
            />
            <GlassButton
              variant={previewDevice === 'desktop' ? 'primary' : 'ghost'}
              size="sm"
              icon={<Monitor className="w-4 h-4" />}
              onClick={() => setPreviewDevice('desktop')}
            />
          </div>
        </div>

        <GlassCard className="p-6 h-[600px] flex items-center justify-center">
          <div className={`${
            previewDevice === 'mobile' 
              ? 'w-[320px] h-[568px]' 
              : 'w-full h-full'
          } bg-gray-900 rounded-lg overflow-hidden`}>
            {/* Preview Header */}
            <div 
              className="h-16 flex items-center px-4"
              style={{ backgroundColor: customization.primaryColor }}
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg mr-3" />
              <div>
                <div className="h-3 w-24 bg-white/40 rounded mb-1" />
                <div className="h-2 w-16 bg-white/20 rounded" />
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-4 space-y-4">
              <div 
                className="h-32 rounded-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor})`
                }}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="h-20 rounded-lg opacity-80"
                  style={{ backgroundColor: customization.secondaryColor }}
                />
                <div 
                  className="h-20 rounded-lg opacity-80"
                  style={{ backgroundColor: customization.accentColor }}
                />
              </div>

              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          </div>
        </GlassCard>

        <motion.button
          whileHover={{ rotate: 180 }}
          className="mx-auto mt-4 p-2 rounded-full bg-white/10 flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Navigation */}
      <div className="lg:col-span-2 flex justify-between items-center">
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

export default StepCustomization