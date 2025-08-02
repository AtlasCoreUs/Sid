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
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StudyTagsAI, STUDY_TAGS, StudyTag } from '@/lib/student/study-tags-system'
import toast from 'react-hot-toast'

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
      {/* Bouton flottant */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, x: 100 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, x: 100 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(true)
              if (!activeNote && notes.length === 0) {
                createNewNote()
              }
            }}
            className="fixed right-6 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
          >
            <StickyNote className="w-6 h-6 text-white" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className={cn(
              "fixed right-0 top-0 h-full bg-black/90 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transition-all",
              isMinimized ? "w-16" : "w-96"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              {!isMinimized && (
                <div className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Notes Rapides</h3>
                  <span className="text-xs text-gray-400">
                    {notes.length} note{notes.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {isMinimized ? 
                    <ChevronLeft className="w-4 h-4 text-gray-400" /> : 
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  }
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
              <div className="flex flex-col h-[calc(100%-60px)]">
                {/* Actions rapides */}
                <div className="flex items-center gap-2 p-3 border-b border-white/10">
                  <button
                    onClick={createNewNote}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Nouvelle note</span>
                  </button>
                  
                  <button
                    onClick={() => setShowTags(!showTags)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      showTags ? "bg-purple-600/30 text-purple-400" : "hover:bg-white/10"
                    )}
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setShowAbbreviations(!showAbbreviations)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      showAbbreviations ? "bg-purple-600/30 text-purple-400" : "hover:bg-white/10"
                    )}
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                {/* Zone de notes */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {activeNote ? (
                    <div className="space-y-4">
                      {/* Tags de la note */}
                      {activeNote.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {activeNote.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                              style={{ 
                                backgroundColor: `${tag.color}20`,
                                borderColor: `${tag.color}40`,
                                borderWidth: '1px'
                              }}
                            >
                              <span>{tag.icon}</span>
                              <span style={{ color: tag.color }}>{tag.label}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Textarea */}
                      <textarea
                        ref={textareaRef}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Écris ta note ici... (Tab pour étendre les abréviations)"
                        className="w-full h-[400px] bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                        style={{ fontFamily: 'monospace' }}
                      />
                      
                      {/* Abréviations détectées */}
                      {detectedAbbreviations.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 flex items-center gap-2">
                            <Brain className="w-3 h-3" />
                            Nouvelles abréviations détectées:
                          </p>
                          {detectedAbbreviations.map((abbr, i) => (
                            <div
                              key={i}
                              className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-mono text-purple-400">
                                  "{abbr.detected}"
                                </span>
                                <span className="text-xs text-gray-500">
                                  {Math.round(abbr.confidence * 100)}% sûr
                                </span>
                              </div>
                              
                              {abbr.suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {abbr.suggestions.map((suggestion, j) => (
                                    <button
                                      key={j}
                                      onClick={() => learnAbbreviation(abbr.detected, suggestion)}
                                      className="text-xs px-2 py-1 bg-purple-600/20 hover:bg-purple-600/30 rounded transition-colors"
                                    >
                                      → {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                              
                              <button
                                onClick={() => {
                                  const custom = prompt(`Que signifie "${abbr.detected}" ?`)
                                  if (custom) {
                                    learnAbbreviation(abbr.detected, custom)
                                  }
                                }}
                                className="text-xs text-purple-400 hover:text-purple-300"
                              >
                                + Définir manuellement
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 mt-20">
                      <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Crée une nouvelle note pour commencer</p>
                    </div>
                  )}
                </div>

                {/* Tags suggérés */}
                {showTags && activeNote && (
                  <div className="border-t border-white/10 p-4">
                    <p className="text-xs text-gray-400 mb-3">Étiquettes suggérées:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(STUDY_TAGS).map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => addTag(tag)}
                          disabled={activeNote.tags.some(t => t.id === tag.id)}
                          className={cn(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs transition-all",
                            activeNote.tags.some(t => t.id === tag.id)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:scale-105"
                          )}
                          style={{ 
                            backgroundColor: `${tag.color}20`,
                            borderColor: `${tag.color}40`,
                            borderWidth: '1px'
                          }}
                        >
                          <span>{tag.icon}</span>
                          <span style={{ color: tag.color }}>{tag.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Abréviations apprises */}
                {showAbbreviations && activeNote && Object.keys(activeNote.abbreviations).length > 0 && (
                  <div className="border-t border-white/10 p-4">
                    <p className="text-xs text-gray-400 mb-3">Abréviations apprises:</p>
                    <div className="space-y-1">
                      {Object.entries(activeNote.abbreviations).map(([abbr, full]) => (
                        <div key={abbr} className="text-xs">
                          <span className="font-mono text-purple-400">{abbr}</span>
                          <span className="text-gray-500"> → </span>
                          <span className="text-gray-300">{full}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Liste des notes */}
                {notes.length > 1 && (
                  <div className="border-t border-white/10 p-4">
                    <p className="text-xs text-gray-400 mb-3">Autres notes:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {notes.filter(n => n.id !== activeNote?.id).map((note) => (
                        <button
                          key={note.id}
                          onClick={() => {
                            setActiveNote(note)
                            setNoteContent(note.content)
                          }}
                          className="w-full text-left p-2 bg-white/5 hover:bg-white/10 rounded transition-colors"
                        >
                          <div className="text-xs text-gray-300 line-clamp-2">
                            {note.content || 'Note vide...'}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {note.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-xs">
                                {tag.icon}
                              </span>
                            ))}
                            {note.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{note.tags.length - 3}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 ml-auto">
                              {new Date(note.updatedAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}