'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Plus, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudyTag {
  id: string
  name: string
  color: string
  category: string
}

const SAMPLE_TAGS: StudyTag[] = [
  { id: '1', name: 'Important', color: 'bg-red-500', category: 'priority' },
  { id: '2', name: 'À réviser', color: 'bg-yellow-500', category: 'study' },
  { id: '3', name: 'Terminé', color: 'bg-green-500', category: 'status' },
  { id: '4', name: 'Question', color: 'bg-blue-500', category: 'type' },
]

export default function StudyTags() {
  const [tags, setTags] = useState<StudyTag[]>(SAMPLE_TAGS)
  const [newTagName, setNewTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState('bg-blue-500')
  const [searchTerm, setSearchTerm] = useState('')

  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500'
  ]

  const addTag = () => {
    if (newTagName.trim()) {
      const newTag: StudyTag = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        color: selectedColor,
        category: 'custom'
      }
      setTags([...tags, newTag])
      setNewTagName('')
    }
  }

  const removeTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId))
  }

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Tags d'étude</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Plus className="w-4 h-4 text-white" />
        </motion.button>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher des tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Ajouter un nouveau tag */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Ajouter un tag</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nom du tag"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Ajouter
          </motion.button>
        </div>
        
        {/* Sélecteur de couleur */}
        <div className="flex gap-2">
          {colors.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColor(color)}
              className={cn(
                "w-6 h-6 rounded-full border-2",
                color,
                selectedColor === color ? "border-white" : "border-transparent"
              )}
            />
          ))}
        </div>
      </div>

      {/* Liste des tags */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Tags existants</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredTags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", tag.color)} />
                <span className="text-white">{tag.name}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeTag(tag.id)}
                className="p-1 hover:bg-red-500/20 rounded transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}