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

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatAssistantProps {
  context?: {
    step?: string
    businessInfo?: any
    template?: string
    features?: string[]
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Message de bienvenue contextuel
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage()
      setMessages([{
        id: '1',
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
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context,
          conversationId
        })
      })

      if (!response.ok) throw new Error('Erreur API')

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setConversationId(data.conversationId)

      // Détecter et extraire les suggestions
      detectSuggestions(data.response)
    } catch (error) {
      toast.error('Oops ! Un problème est survenu. Réessaie stp ! 🙏')
    } finally {
      setIsLoading(false)
    }
  }

  const detectSuggestions = (response: string) => {
    // Détecter les suggestions de couleurs
    const colorRegex = /#([A-Fa-f0-9]{6})/g
    const colors = response.match(colorRegex)
    if (colors && onSuggestion) {
      onSuggestion({ type: 'colors', data: colors })
    }

    // Détecter les suggestions de fonctionnalités
    if (response.includes('fonctionnalité') || response.includes('feature')) {
      // Parser les suggestions (à améliorer selon le format de réponse)
      // onSuggestion({ type: 'features', data: [...] })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg flex items-center justify-center group"
          >
            <Sparkles className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
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
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold">SID Assistant</h3>
                    <p className="text-xs text-gray-400">Toujours là pour toi ! 🚀</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
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
                            "max-w-[80%] p-3 rounded-2xl",
                            message.role === 'user'
                              ? 'bg-primary/20 text-white ml-auto'
                              : 'bg-white/10 text-gray-100'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
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
                        <div className="bg-white/10 p-3 rounded-2xl">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">SID réfléchit...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Pose ta question..."
                        className="flex-1 px-4 py-2 bg-white/10 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        disabled={isLoading}
                      />
                      <GlassButton
                        variant="neon"
                        size="sm"
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="rounded-full"
                      >
                        <Send className="w-4 h-4" />
                      </GlassButton>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                        <History className="w-3 h-3" />
                        Historique
                      </button>
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