'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { 
  MessageCircle, 
  Send, 
  X, 
  Sparkles, 
  Loader2,
  Minimize2,
  Maximize2,
  History
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { DynamicResponseGenerator, ChatContext } from '@/lib/ai/contextual-chat'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: Array<{
    text: string
    value: any
  }>
}

interface AIChatAssistantProps {
  context?: {
    step?: string
    data?: any
  }
  onSuggestion?: (suggestion: any) => void
}

export default function AIChatAssistant({ context, onSuggestion }: AIChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState({
    techLevel: 'beginner' as 'beginner' | 'intermediate' | 'expert',
    businessType: '',
    previousQuestions: [] as string[]
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Générateur de réponses intelligent
  const responseGenerator = new DynamicResponseGenerator()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage()
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }])
    }
  }, [isOpen, context?.step])

  const getWelcomeMessage = () => {
    switch (context?.step) {
      case 'businessInfo':
        return "Salut ! Je suis SID 🚀 Je vais t'aider à créer une app incroyable ! Dis-moi, c'est quoi ton projet ?"
      case 'template':
        return "Super choix ! 🎨 Quel type d'app tu veux créer ? Je peux te recommander le template parfait !"
      case 'features':
        return "C'est parti pour les fonctionnalités ! 🛠️ Qu'est-ce qui est le plus important pour ton business ?"
      case 'customization':
        return "Time to shine ! ✨ Parlons design. Tu as des couleurs préférées pour ton brand ?"
      default:
        return "Hey ! Je suis SID, ton assistant IA 🤖 Comment je peux t'aider aujourd'hui ?"
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setInput('')
    setIsLoading(true)
    
    // Mettre à jour le profil utilisateur
    setUserProfile(prev => ({
      ...prev,
      previousQuestions: [...prev.previousQuestions.slice(-4), userMessage]
    }))

    try {
      // Créer le contexte pour le générateur
      const chatContext: ChatContext = {
        currentStep: context?.step || 'general',
        userProfile: userProfile,
        appData: context?.data
      }
      
      // Générer une réponse intelligente localement d'abord
      const smartResponse = responseGenerator.generateResponse(chatContext, userMessage)
      
      // Afficher immédiatement la réponse intelligente
      const smartMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: smartResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, smartMessage])
      
      // Détecter si des suggestions sont mentionnées
      detectSuggestions(smartResponse)
      
      // Ensuite, appeler l'API pour une réponse plus approfondie si nécessaire
      if (userMessage.length > 20 && !smartResponse.includes("Je peux aussi:")) {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            context: context,
            conversationId: conversationId
          })
        })

        if (!response.ok) throw new Error('Erreur API')

        const data = await response.json()
        
        // Ajouter la réponse API comme un complément
        if (data.response && data.response !== smartResponse) {
          const apiMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: "📚 Info supplémentaire: " + data.response,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, apiMessage])
        }
        
        if (data.conversationId) {
          setConversationId(data.conversationId)
        }
      }
    } catch (error) {
      console.error('Erreur chat:', error)
      // L'utilisateur a déjà reçu une réponse intelligente, pas besoin d'erreur
    } finally {
      setIsLoading(false)
    }
  }

  const detectSuggestions = (response: string) => {
    // Détecter les suggestions de couleurs
    const colorMatch = response.match(/couleurs?:?\s*#([A-Fa-f0-9]{6})/gi)
    if (colorMatch && onSuggestion) {
      const colors = colorMatch.map(match => {
        const hex = match.match(/#([A-Fa-f0-9]{6})/i)
        return hex ? `#${hex[1]}` : null
      }).filter(Boolean)
      
      if (colors.length > 0) {
        onSuggestion({ type: 'colors', values: colors })
      }
    }
    
    // Détecter les suggestions de features
    if (response.includes("fonctionnalités recommandées") && onSuggestion) {
      const features = response.match(/- (.+)/g)?.map(f => f.replace('- ', ''))
      if (features) {
        onSuggestion({ type: 'features', values: features })
      }
    }
    
    // Détecter les suggestions de templates
    if (response.includes("template") && response.includes("recommand") && onSuggestion) {
      const templates = ['restaurant', 'clinic', 'salon', 'gym', 'hotel', 'agency']
      const suggestedTemplate = templates.find(t => response.toLowerCase().includes(t))
      if (suggestedTemplate) {
        onSuggestion({ type: 'template', value: suggestedTemplate })
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  // Détecter le niveau technique de l'utilisateur
  useEffect(() => {
    if (messages.length > 3) {
      const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase())
      
      // Analyser le niveau technique basé sur le vocabulaire
      const techWords = ['api', 'database', 'backend', 'frontend', 'deploy', 'server', 'code']
      const beginnerWords = ['comment', 'difficile', 'compliqué', 'aide', 'comprends pas']
      
      const techScore = userMessages.reduce((score, msg) => {
        return score + techWords.filter(word => msg.includes(word)).length
      }, 0)
      
      const beginnerScore = userMessages.reduce((score, msg) => {
        return score + beginnerWords.filter(word => msg.includes(word)).length
      }, 0)
      
      if (techScore > 3) {
        setUserProfile(prev => ({ ...prev, techLevel: 'expert' }))
      } else if (beginnerScore > 2) {
        setUserProfile(prev => ({ ...prev, techLevel: 'beginner' }))
      } else {
        setUserProfile(prev => ({ ...prev, techLevel: 'intermediate' }))
      }
    }
  }, [messages])

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-primary to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all group z-50"
          >
            <MessageCircle className="w-6 h-6 text-white" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-primary to-pink-600 rounded-full opacity-30 blur-lg group-hover:opacity-50 transition-opacity"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={cn(
              "fixed z-50 transition-all duration-300",
              isMinimized 
                ? "bottom-6 right-6 w-80 h-16" 
                : "bottom-6 right-6 w-96 h-[600px] max-h-[80vh]"
            )}
          >
            <GlassCard className="h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-primary to-pink-600 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">SID Assistant</h3>
                    <p className="text-xs text-gray-400">
                      {isLoading ? 'Réfléchit...' : 'En ligne'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Minimize2 className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex",
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-3",
                            message.role === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-white/10 text-gray-200'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          
                          {message.suggestions && (
                            <div className="mt-2 space-y-1">
                              {message.suggestions.map((suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() => onSuggestion?.(suggestion.value)}
                                  className="block w-full text-left text-xs bg-white/10 hover:bg-white/20 rounded px-2 py-1 transition-colors"
                                >
                                  {suggestion.text}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-xs opacity-50 mt-1">
                            {message.timestamp.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-sm text-gray-400">
                              SID réfléchit...
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Pose-moi une question..."
                        className="flex-1 bg-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                      />
                      
                      <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-xs text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1">
                        <History className="w-3 h-3" />
                        Historique
                      </button>
                      
                      <span className="text-xs text-gray-500">
                        Niveau: {userProfile.techLevel === 'beginner' ? '🌱 Débutant' : 
                                userProfile.techLevel === 'intermediate' ? '🌿 Intermédiaire' : 
                                '🌳 Expert'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}