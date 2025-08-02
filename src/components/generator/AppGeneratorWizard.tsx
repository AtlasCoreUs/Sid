'use client'

import React from 'react'
import { useAppStore } from '@/store/useAppStore'
import StepBusinessInfo from './steps/StepBusinessInfo'
import StepTemplate from './steps/StepTemplate'
import StepCustomization from './steps/StepCustomization'
import StepFeatures from './steps/StepFeatures'
import StepReview from './steps/StepReview'
import AIChatAssistant from '@/components/ai/AIChatAssistant'

const AppGeneratorWizard: React.FC = () => {
  const { generatorStep, generatorData, updateGeneratorData } = useAppStore()

  const renderStep = () => {
    switch (generatorStep) {
      case 1:
        return <StepBusinessInfo />
      case 2:
        return <StepTemplate />
      case 3:
        return <StepCustomization />
      case 4:
        return <StepFeatures />
      case 5:
        return <StepReview />
      default:
        return <StepBusinessInfo />
    }
  }

  const getStepName = () => {
    switch (generatorStep) {
      case 1: return 'businessInfo'
      case 2: return 'template'
      case 3: return 'customization'
      case 4: return 'features'
      case 5: return 'review'
      default: return 'businessInfo'
    }
  }

  const handleAISuggestion = (suggestion: any) => {
    if (suggestion.type === 'colors' && generatorStep === 3) {
      // Appliquer les suggestions de couleurs
      if (suggestion.data.length >= 3) {
        updateGeneratorData({
          customization: {
            ...generatorData.customization,
            primaryColor: suggestion.data[0],
            secondaryColor: suggestion.data[1],
            accentColor: suggestion.data[2],
          }
        })
      }
    }
    // Ajouter d'autres types de suggestions selon les besoins
  }

  return (
    <div className="w-full">
      {renderStep()}
      <AIChatAssistant 
        context={{
          step: getStepName(),
          businessInfo: generatorData.businessInfo,
          template: generatorData.template,
          features: generatorData.features,
        }}
        onSuggestion={handleAISuggestion}
      />
    </div>
  )
}

export default AppGeneratorWizard