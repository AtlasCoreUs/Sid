'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  StickyNote, 
  X, 
  Minimize2, 
  Maximize2, 
  Tag,
  Save,
  Sparkles,
  Zap,
  Hash,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Brain,
  FileText, 
  Bold,
  Italic,
  Underline,
  Highlighter,
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link2,
  Image
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StudyTagsAI, STUDY_TAGS, StudyTag } from '@/lib/student/study-tags-system'
import toast from 'react-hot-toast'
import { useNotesStore } from '@/store/useNotesStore'
import StudyTags from './StudyTags'
import HandwritingCanvas from './HandwritingCanvas'

interface Note {
  id: string
  content: string
  tags: StudyTag[]
  abbreviations: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

export default function FloatingSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [noteContent, setNoteContent] = useState('')
  const [showTags, setShowTags] = useState(false)
  const [showAbbreviations, setShowAbbreviations] = useState(false)
  const [detectedAbbreviations, setDetectedAbbreviations] = useState<Array<{
    detected: string
    suggestions: string[]
    confidence: number
  }>>([])
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const tagsAI = useRef(new StudyTagsAI()).current
  const userId = 'current-user' // À remplacer par l'ID réel

  const [activeView, setActiveView] = useState<'notes' | 'canvas' | null>(null)
  const [showFormattingBar, setShowFormattingBar] = useState(true)
  const [carouselRotation, setCarouselRotation] = useState(0)
  const [selectedTool, setSelectedTool] = useState(0)
  
  // Outils de formatage style Photoshop
  const formattingTools = [
    { icon: Bold, name: 'Gras', shortcut: 'Cmd+B', action: 'bold' },
    { icon: Italic, name: 'Italique', shortcut: 'Cmd+I', action: 'italic' },
    { icon: Underline, name: 'Souligné', shortcut: 'Cmd+U', action: 'underline' },
    { icon: Highlighter, name: 'Surligneur', shortcut: 'Cmd+H', action: 'highlight' },
    { icon: Type, name: 'Taille', submenu: ['12px', '14px', '16px', '18px', '24px'] },
    { icon: Palette, name: 'Couleur', type: 'color' },
    { icon: AlignLeft, name: 'Aligner gauche', action: 'align-left' },
    { icon: AlignCenter, name: 'Centrer', action: 'align-center' },
    { icon: AlignRight, name: 'Aligner droite', action: 'align-right' },
    { icon: List, name: 'Liste', action: 'bullet-list' },
    { icon: ListOrdered, name: 'Liste numérotée', action: 'numbered-list' },
    { icon: Link2, name: 'Lien', action: 'link' },
    { icon: Image, name: 'Image', action: 'image' },
    { icon: Sparkles, name: 'IA Style', action: 'ai-style' }
  ]

  // Carrousel 3D d'outils
  const mainTools = [
    { icon: FileText, name: 'Notes', color: 'from-blue-500 to-cyan-500' },
    { icon: Tag, name: 'Tags', color: 'from-purple-500 to-pink-500' },
    { icon: Search, name: 'Recherche', color: 'from-green-500 to-emerald-500' },
    { icon: Plus, name: 'Nouveau', color: 'from-orange-500 to-red-500' }
  ]

  const rotateCarousel = (direction: 'left' | 'right') => {
    const increment = direction === 'left' ? -90 : 90
    setCarouselRotation(prev => prev + increment)
    setSelectedTool(prev => {
      const newIndex = direction === 'left' 
        ? (prev - 1 + mainTools.length) % mainTools.length
        : (prev + 1) % mainTools.length
      return newIndex
    })
  }

  const applyFormatting = (action: string) => {
    // Logique de formatage à implémenter avec l'éditeur de texte
    console.log('Applying formatting:', action)
    
    // Animation de feedback
    const button = document.querySelector(`[data-action="${action}"]`)
    if (button) {
      button.classList.add('scale-110')
      setTimeout(() => button.classList.remove('scale-110'), 200)
    }
  }

  // Auto-save
  useEffect(() => {
    if (activeNote && noteContent !== activeNote.content) {
      const timer = setTimeout(() => {
        saveNote()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [noteContent])

  // Détection d'abréviations en temps réel
  useEffect(() => {
    if (noteContent) {
      const newAbbreviations = tagsAI.detectNewAbbreviations(noteContent)
      setDetectedAbbreviations(newAbbreviations)
    }
  }, [noteContent])

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      tags: [],
      abbreviations: {},
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setNotes([newNote, ...notes])
    setActiveNote(newNote)
    setNoteContent('')
  }

  const saveNote = () => {
    if (!activeNote) return
    
    const updatedNote = {
      ...activeNote,
      content: noteContent,
      updatedAt: new Date()
    }
    
    setNotes(notes.map(n => n.id === activeNote.id ? updatedNote : n))
    setActiveNote(updatedNote)
    
    // Animation de sauvegarde
    toast.success('Note sauvegardée', { 
      duration: 1000,
      style: {
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: '#10B981'
      }
    })
  }

  const addTag = (tag: StudyTag) => {
    if (!activeNote) return
    
    const updatedNote = {
      ...activeNote,
      tags: [...activeNote.tags, tag]
    }
    
    setNotes(notes.map(n => n.id === activeNote.id ? updatedNote : n))
    setActiveNote(updatedNote)
  }

  const learnAbbreviation = (abbreviation: string, fullForm: string) => {
    tagsAI.learnAbbreviation(abbreviation, fullForm, userId)
    
    if (activeNote) {
      const updatedNote = {
        ...activeNote,
        abbreviations: {
          ...activeNote.abbreviations,
          [abbreviation]: fullForm
        }
      }
      setNotes(notes.map(n => n.id === activeNote.id ? updatedNote : n))
      setActiveNote(updatedNote)
    }
    
    // Retirer des suggestions
    setDetectedAbbreviations(detectedAbbreviations.filter(d => d.detected !== abbreviation))
    
    toast.success(`"${abbreviation}" → "${fullForm}" appris !`, {
      icon: '🧠'
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Expansion d'abréviation avec Tab
    if (e.key === 'Tab' && !e.shiftKey) {
      const cursorPosition = textareaRef.current?.selectionStart || 0
      const textBeforeCursor = noteContent.substring(0, cursorPosition)
      const words = textBeforeCursor.split(/\s+/)
      const lastWord = words[words.length - 1]
      
      if (lastWord) {
        const expansions = tagsAI.expandAbbreviation(lastWord, userId)
        if (expansions.length > 0) {
          e.preventDefault()
          
          // Remplacer l'abréviation
          const newContent = 
            noteContent.substring(0, cursorPosition - lastWord.length) +
            expansions[0] +
            noteContent.substring(cursorPosition)
          
          setNoteContent(newContent)
          
          // Repositionner le curseur
          setTimeout(() => {
            if (textareaRef.current) {
              const newPosition = cursorPosition - lastWord.length + expansions[0].length
              textareaRef.current.selectionStart = newPosition
              textareaRef.current.selectionEnd = newPosition
              textareaRef.current.focus()
            }
          }, 0)
        }
      }
    }
  }

  return (
    <>
      {/* Bouton flottant principal avec carrousel 3D */}
      <motion.div
        className="fixed right-6 bottom-24 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="relative w-16 h-16 perspective-1000">
          {/* Carrousel 3D */}
          <motion.div
            className="absolute inset-0 transform-style-3d"
            animate={{ rotateY: carouselRotation }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {mainTools.map((tool, index) => {
              const rotation = index * 90
              const isActive = index === selectedTool
              
              return (
                <motion.button
                  key={tool.name}
                  onClick={() => {
                    if (isActive) {
                      setIsOpen(true)
                      setActiveView(index === 0 ? 'notes' : null)
                    }
                  }}
                  className={cn(
                    "absolute inset-0 rounded-2xl shadow-lg",
                    "flex items-center justify-center",
                    "transition-all duration-300",
                    isActive && "shadow-2xl scale-110"
                  )}
                  style={{
                    transform: `rotateY(${rotation}deg) translateZ(32px)`,
                    backfaceVisibility: 'hidden'
                  }}
                  whileHover={{ scale: isActive ? 1.15 : 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={cn(
                    "w-full h-full rounded-2xl",
                    "bg-gradient-to-br",
                    tool.color,
                    "flex items-center justify-center",
                    "backdrop-blur-xl"
                  )}>
                    <tool.icon className="w-7 h-7 text-white" />
                  </div>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Contrôles carrousel */}
          <button
            onClick={() => rotateCarousel('left')}
            className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => rotateCarousel('right')}
            className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Label de l'outil actuel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <span className="text-xs text-white/80 bg-black/50 backdrop-blur-xl px-3 py-1 rounded-full">
            {mainTools[selectedTool].name}
          </span>
        </motion.div>
      </motion.div>

      {/* Barre de formatage style Photoshop */}
      <AnimatePresence>
        {isOpen && showFormattingBar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-2xl">
              <div className="flex items-center gap-1">
                {formattingTools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    {tool.type === 'color' ? (
                      <div className="relative group">
                        <button
                          className="p-2 rounded-lg hover:bg-white/10 transition-all group relative"
                          title={tool.name}
                        >
                          <tool.icon className="w-4 h-4 text-white" />
                          <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => applyFormatting(`color:${e.target.value}`)}
                          />
                        </button>
                      </div>
                    ) : tool.submenu ? (
                      <div className="relative group">
                        <button
                          className="p-2 rounded-lg hover:bg-white/10 transition-all"
                          title={tool.name}
                        >
                          <tool.icon className="w-4 h-4 text-white" />
                        </button>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                          <div className="bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 p-1">
                            {tool.submenu.map(size => (
                              <button
                                key={size}
                                onClick={() => applyFormatting(`size:${size}`)}
                                className="block w-full px-3 py-1 text-xs text-white hover:bg-white/10 rounded transition-colors text-left"
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        data-action={tool.action}
                        onClick={() => applyFormatting(tool.action!)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-all relative group"
                        title={`${tool.name} ${tool.shortcut || ''}`}
                      >
                        <tool.icon className="w-4 h-4 text-white" />
                        {tool.shortcut && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white/60 bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {tool.shortcut}
                          </span>
                        )}
                      </button>
                    )}
                  </motion.div>
                ))}
                
                <div className="w-px h-6 bg-white/20 mx-1" />
                
                {/* Bouton IA Style */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: formattingTools.length * 0.03 }}
                  onClick={() => applyFormatting('ai-enhance')}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  IA Style
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar principale existante */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-black/90 backdrop-blur-xl border-l border-white/10 shadow-2xl z-40 overflow-hidden"
          >
            {/* Header avec fermeture */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {React.createElement(mainTools[selectedTool].icon, { className: "w-5 h-5" })}
                {mainTools[selectedTool].name}
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setActiveView(null)
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Contenu dynamique selon l'outil sélectionné */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedTool === 0 && <StudyTags />}
              {selectedTool === 1 && (
                <div className="text-white">
                  <h3 className="text-lg font-semibold mb-4">Gestion des Tags</h3>
                  {/* Contenu tags */}
                </div>
              )}
              {selectedTool === 2 && (
                <div className="text-white">
                  <h3 className="text-lg font-semibold mb-4">Recherche Intelligente</h3>
                  {/* Contenu recherche */}
                </div>
              )}
              {selectedTool === 3 && (
                <div className="text-white">
                  <h3 className="text-lg font-semibold mb-4">Créer Nouveau</h3>
                  {/* Contenu création */}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas handwriting si activeView === 'canvas' */}
      {activeView === 'canvas' && <HandwritingCanvas />}
    </>
  )
}