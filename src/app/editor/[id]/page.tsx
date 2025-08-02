'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import GlassCard from '@/components/ui/GlassCard'
import GlassButton from '@/components/ui/GlassButton'
import { 
  ArrowLeft,
  Save,
  Eye,
  Smartphone,
  Monitor,
  Settings,
  Layers,
  Type,
  Image,
  Plus,
  Trash2,
  Move,
  Edit3,
  Palette,
  Grid,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface AppData {
  id: string
  name: string
  slug: string
  template: string
  settings: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    features: string[]
    metadata: any
  }
  pages: Array<{
    id: string
    title: string
    slug: string
    content: any
    isHomePage: boolean
  }>
}

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const [app, setApp] = useState<AppData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedPage, setSelectedPage] = useState<string>('')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [selectedElement, setSelectedElement] = useState<any>(null)
  const [sidebarTab, setSidebarTab] = useState<'pages' | 'design' | 'elements'>('pages')

  useEffect(() => {
    fetchApp()
  }, [params.id])

  const fetchApp = async () => {
    try {
      const response = await fetch(`/api/apps/${params.id}`)
      if (!response.ok) throw new Error('App non trouvée')
      
      const data = await response.json()
      setApp(data)
      if (data.pages.length > 0) {
        setSelectedPage(data.pages[0].id)
      }
    } catch (error) {
      toast.error('Impossible de charger l\'app')
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const saveChanges = async () => {
    if (!app) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/apps/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app)
      })

      if (!response.ok) throw new Error('Erreur de sauvegarde')
      
      toast.success('Modifications sauvegardées !')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const addSection = (type: string) => {
    if (!app || !selectedPage) return
    
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      content: getDefaultContent(type)
    }

    const updatedApp = { ...app }
    const pageIndex = updatedApp.pages.findIndex(p => p.id === selectedPage)
    if (pageIndex >= 0) {
      updatedApp.pages[pageIndex].content.sections = [
        ...(updatedApp.pages[pageIndex].content.sections || []),
        newSection
      ]
      setApp(updatedApp)
    }
  }

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          title: 'Titre principal',
          subtitle: 'Sous-titre accrocheur',
          buttonText: 'Call to Action',
          image: ''
        }
      case 'text':
        return {
          title: 'Section titre',
          text: 'Votre contenu ici...',
          alignment: 'left'
        }
      case 'gallery':
        return {
          title: 'Galerie',
          images: [],
          layout: 'grid'
        }
      case 'contact':
        return {
          title: 'Contactez-nous',
          showForm: true,
          showMap: true,
          showInfo: true
        }
      default:
        return {}
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  if (!app) return null

  const currentPage = app.pages.find(p => p.id === selectedPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <GlassButton variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                  Retour
                </GlassButton>
              </Link>
              <h1 className="text-xl font-semibold">{app.name} - Éditeur</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <GlassButton
                variant="ghost"
                size="sm"
                icon={<Eye className="w-4 h-4" />}
                onClick={() => window.open(`https://${app.slug}.sid-app.com`, '_blank')}
              >
                Prévisualiser
              </GlassButton>
              <GlassButton
                variant="neon"
                size="sm"
                icon={<Save className="w-4 h-4" />}
                onClick={saveChanges}
                disabled={isSaving}
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </GlassButton>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-white/10 bg-black/50 overflow-y-auto">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setSidebarTab('pages')}
              className={`flex-1 p-3 text-sm font-medium transition-colors ${
                sidebarTab === 'pages' ? 'bg-white/10 text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 mx-auto mb-1" />
              Pages
            </button>
            <button
              onClick={() => setSidebarTab('design')}
              className={`flex-1 p-3 text-sm font-medium transition-colors ${
                sidebarTab === 'design' ? 'bg-white/10 text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4 mx-auto mb-1" />
              Design
            </button>
            <button
              onClick={() => setSidebarTab('elements')}
              className={`flex-1 p-3 text-sm font-medium transition-colors ${
                sidebarTab === 'elements' ? 'bg-white/10 text-primary' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4 mx-auto mb-1" />
              Éléments
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-4">
            {sidebarTab === 'pages' && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold mb-3">Pages de l'app</h3>
                {app.pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPage(page.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedPage === page.id
                        ? 'bg-primary/20 border border-primary/50'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{page.title}</span>
                      {page.isHomePage && (
                        <span className="text-xs bg-primary/20 px-2 py-1 rounded">
                          Accueil
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">/{page.slug}</p>
                  </button>
                ))}
                <GlassButton
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Ajouter une page
                </GlassButton>
              </div>
            )}

            {sidebarTab === 'design' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold mb-3">Personnalisation</h3>
                
                {/* Colors */}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Couleur principale</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={app.settings.primaryColor}
                      onChange={(e) => {
                        const updatedApp = { ...app }
                        updatedApp.settings.primaryColor = e.target.value
                        setApp(updatedApp)
                      }}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={app.settings.primaryColor}
                      onChange={(e) => {
                        const updatedApp = { ...app }
                        updatedApp.settings.primaryColor = e.target.value
                        setApp(updatedApp)
                      }}
                      className="flex-1 glass-input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">Couleur secondaire</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={app.settings.secondaryColor}
                      onChange={(e) => {
                        const updatedApp = { ...app }
                        updatedApp.settings.secondaryColor = e.target.value
                        setApp(updatedApp)
                      }}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={app.settings.secondaryColor}
                      onChange={(e) => {
                        const updatedApp = { ...app }
                        updatedApp.settings.secondaryColor = e.target.value
                        setApp(updatedApp)
                      }}
                      className="flex-1 glass-input text-sm"
                    />
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Police</label>
                  <select className="w-full glass-input text-sm">
                    <option>Modern</option>
                    <option>Classic</option>
                    <option>Playful</option>
                    <option>Elegant</option>
                  </select>
                </div>
              </div>
            )}

            {sidebarTab === 'elements' && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold mb-3">Ajouter des sections</h3>
                
                <button
                  onClick={() => addSection('hero')}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center">
                      <Image className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Hero Banner</p>
                      <p className="text-xs text-gray-400">Section d'accueil avec image</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => addSection('text')}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded flex items-center justify-center">
                      <Type className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Texte</p>
                      <p className="text-xs text-gray-400">Paragraphe avec titre</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => addSection('gallery')}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded flex items-center justify-center">
                      <Grid className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Galerie</p>
                      <p className="text-xs text-gray-400">Grille d'images</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => addSection('contact')}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-xs text-gray-400">Formulaire et infos</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Preview Controls */}
          <div className="border-b border-white/10 p-3 flex items-center justify-between bg-black/50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded transition-colors ${
                  previewMode === 'desktop' ? 'bg-white/10 text-primary' : 'text-gray-400'
                }`}
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded transition-colors ${
                  previewMode === 'mobile' ? 'bg-white/10 text-primary' : 'text-gray-400'
                }`}
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-sm text-gray-400">
              Édition de : <span className="text-white font-medium">{currentPage?.title}</span>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-gray-900 p-8 overflow-auto">
            <div
              className={`mx-auto bg-white rounded-lg shadow-2xl transition-all ${
                previewMode === 'mobile' ? 'max-w-sm' : 'max-w-6xl'
              }`}
              style={{ minHeight: '600px' }}
            >
              {/* Page Preview */}
              {currentPage && (
                <div className="p-8">
                  {currentPage.content.sections?.map((section: any, index: number) => (
                    <div
                      key={section.id}
                      className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors cursor-pointer relative group"
                      onClick={() => setSelectedElement(section)}
                    >
                      {/* Section Controls */}
                      <div className="absolute -top-3 right-4 bg-white shadow-lg rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <button className="text-gray-600 hover:text-primary">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-primary">
                          <Move className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Section Content Preview */}
                      <div className="text-gray-900">
                        {section.type === 'hero' && (
                          <div className="text-center py-12">
                            <h1 className="text-4xl font-bold mb-4">{section.content.title}</h1>
                            <p className="text-xl text-gray-600 mb-8">{section.content.subtitle}</p>
                            <button className="px-8 py-3 bg-primary text-white rounded-lg">
                              {section.content.buttonText}
                            </button>
                          </div>
                        )}
                        
                        {section.type === 'text' && (
                          <div>
                            <h2 className="text-2xl font-bold mb-4">{section.content.title}</h2>
                            <p className="text-gray-600">{section.content.text}</p>
                          </div>
                        )}
                        
                        {section.type === 'gallery' && (
                          <div>
                            <h2 className="text-2xl font-bold mb-4">{section.content.title}</h2>
                            <div className="grid grid-cols-3 gap-4">
                              {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {section.type === 'contact' && (
                          <div>
                            <h2 className="text-2xl font-bold mb-4">{section.content.title}</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <input className="w-full p-3 border rounded-lg" placeholder="Nom" />
                                <input className="w-full p-3 border rounded-lg" placeholder="Email" />
                                <textarea className="w-full p-3 border rounded-lg" rows={4} placeholder="Message" />
                                <button className="w-full py-3 bg-primary text-white rounded-lg">
                                  Envoyer
                                </button>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-4">
                                <p className="font-semibold mb-2">Adresse</p>
                                <p className="text-gray-600">123 Rue Example</p>
                                <p className="text-gray-600">75001 Paris</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {(!currentPage.content.sections || currentPage.content.sections.length === 0) && (
                    <div className="text-center py-20 text-gray-400">
                      <Grid className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-4">Cette page est vide</p>
                      <p className="text-sm">Ajoutez des sections depuis le panneau de gauche</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Element Properties Panel */}
        {selectedElement && (
          <div className="w-80 border-l border-white/10 bg-black/50 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-4">Propriétés de l'élément</h3>
            
            {selectedElement.type === 'hero' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Titre</label>
                  <input
                    type="text"
                    value={selectedElement.content.title}
                    onChange={(e) => {
                      // Update element content
                    }}
                    className="w-full glass-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Sous-titre</label>
                  <input
                    type="text"
                    value={selectedElement.content.subtitle}
                    className="w-full glass-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Texte du bouton</label>
                  <input
                    type="text"
                    value={selectedElement.content.buttonText}
                    className="w-full glass-input text-sm"
                  />
                </div>
              </div>
            )}
            
            <button
              onClick={() => setSelectedElement(null)}
              className="mt-6 text-sm text-gray-400 hover:text-white"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}