'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Pen, 
  Type, 
  Mic, 
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  Download,
  Share2,
  Eraser,
  Palette,
  FileText,
  ChevronUp,
  ChevronDown,
  Grid3x3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StudyTagsAI } from '@/lib/student/study-tags-system'
import toast from 'react-hot-toast'
import VoiceRecorder from './VoiceRecorder'

interface HandwritingLine {
  id: string
  strokes: Array<{
    points: Array<{ x: number; y: number; pressure?: number }>
    color: string
    width: number
  }>
  recognizedText?: string
  timestamp: Date
  isProcessing?: boolean
}

interface CanvasSettings {
  mode: 'pen' | 'eraser' | 'text' | 'voice'
  penColor: string
  penWidth: number
  showGrid: boolean
  showRecognized: boolean
  autoRecognize: boolean
  recognitionDelay: number
  expandAbbreviations: boolean
  correctSpelling: boolean
  orientation: 'portrait' | 'landscape'
}

export default function HandwritingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const recognitionCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentLine, setCurrentLine] = useState<HandwritingLine | null>(null)
  const [lines, setLines] = useState<HandwritingLine[]>([])
  const [recognizedNotes, setRecognizedNotes] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showRecognizedPanel, setShowRecognizedPanel] = useState(true)
  
  const [settings, setSettings] = useState<CanvasSettings>({
    mode: 'pen',
    penColor: '#FFFFFF',
    penWidth: 2,
    showGrid: true,
    showRecognized: true,
    autoRecognize: true,
    recognitionDelay: 1500,
    expandAbbreviations: true,
    correctSpelling: false,
    orientation: 'landscape'
  })

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 })
  const [userPreferredSize, setUserPreferredSize] = useState({ 
    width: '60%', 
    height: '500px' 
  })

  const tagsAI = useRef(new StudyTagsAI()).current
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Redimensionnement dynamique
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCanvasSize({
          width: rect.width,
          height: rect.height
        })
      }
    }

    updateCanvasSize()

    resizeObserverRef.current = new ResizeObserver(updateCanvasSize)
    if (containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current)
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  // Gestion du canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid if enabled
    if (settings.showGrid) {
      drawGrid(ctx, canvas.width, canvas.height)
    }

    // Redraw all lines
    lines.forEach(line => {
      line.strokes.forEach(stroke => {
        drawStroke(ctx, stroke)
      })
    })

    // Draw current line
    if (currentLine) {
      currentLine.strokes.forEach(stroke => {
        drawStroke(ctx, stroke)
      })
    }
  }, [lines, currentLine, settings.showGrid, canvasSize])

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1

    // Horizontal lines
    const lineHeight = 30
    for (let y = lineHeight; y < height; y += lineHeight) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Vertical lines (for grid)
    const columnWidth = 50
    for (let x = columnWidth; x < width; x += columnWidth) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
  }

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: any) => {
    if (stroke.points.length < 2) return

    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
    }

    ctx.stroke()
  }

  const startDrawing = (e: React.PointerEvent | React.TouchEvent) => {
    if (settings.mode !== 'pen' && settings.mode !== 'eraser') return

    const point = getPointerPosition(e)
    if (!point) return

    setIsDrawing(true)

    if (settings.mode === 'pen') {
      const newLine: HandwritingLine = {
        id: Date.now().toString(),
        strokes: [{
          points: [point],
          color: settings.penColor,
          width: settings.penWidth
        }],
        timestamp: new Date()
      }
      setCurrentLine(newLine)
    }
  }

  const draw = (e: React.PointerEvent | React.TouchEvent) => {
    if (!isDrawing) return

    const point = getPointerPosition(e)
    if (!point) return

    if (settings.mode === 'pen' && currentLine) {
      const lastStroke = currentLine.strokes[currentLine.strokes.length - 1]
      lastStroke.points.push(point)
      setCurrentLine({ ...currentLine })
    } else if (settings.mode === 'eraser') {
      // Eraser logic - remove points near cursor
      eraseAt(point)
    }
  }

  const endDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    if (currentLine && currentLine.strokes[0].points.length > 5) {
      // Check if line is complete (détection fin de ligne)
      const lastPoint = currentLine.strokes[0].points[currentLine.strokes[0].points.length - 1]
      const isEndOfLine = detectEndOfLine(currentLine)

      if (isEndOfLine && settings.autoRecognize) {
        // Start recognition after delay
        recognitionTimeoutRef.current = setTimeout(() => {
          recognizeLine(currentLine)
        }, settings.recognitionDelay)
      }

      setLines([...lines, currentLine])
      setCurrentLine(null)
    }
  }

  const getPointerPosition = (e: React.PointerEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    let clientX: number, clientY: number, pressure: number | undefined

    if ('touches' in e) {
      if (e.touches.length === 0) return null
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
      // @ts-ignore - pressure exists on touch events
      pressure = e.touches[0].force || e.touches[0].pressure
    } else {
      clientX = e.clientX
      clientY = e.clientY
      pressure = e.pressure
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      pressure
    }
  }

  const detectEndOfLine = (line: HandwritingLine): boolean => {
    // Détection basée sur:
    // 1. Position Y (retour à la ligne)
    // 2. Ponctuation (, . ; :)
    // 3. Temps d'arrêt
    
    const points = line.strokes[0].points
    if (points.length < 10) return false

    // Check if we're at the right edge
    const lastX = points[points.length - 1].x
    if (lastX > canvasSize.width * 0.85) return true

    // Check vertical movement (new line)
    const lastY = points[points.length - 1].y
    const firstY = points[0].y
    if (Math.abs(lastY - firstY) > 50) return true

    return false
  }

  const recognizeLine = async (line: HandwritingLine) => {
    // Simulate OCR recognition
    setLines(lines.map(l => 
      l.id === line.id ? { ...l, isProcessing: true } : l
    ))

    try {
      // TODO: Real OCR integration here
      const recognizedText = await simulateOCR(line)
      
      let processedText = recognizedText

      // Expand abbreviations if enabled
      if (settings.expandAbbreviations) {
        processedText = expandAbbreviations(processedText)
      }

      // Correct spelling if enabled
      if (settings.correctSpelling) {
        processedText = await correctSpelling(processedText)
      }

      setLines(lines.map(l => 
        l.id === line.id ? { 
          ...l, 
          recognizedText: processedText, 
          isProcessing: false 
        } : l
      ))

      setRecognizedNotes([...recognizedNotes, processedText])

      // Animate line disappearing
      setTimeout(() => {
        animateLineDisappear(line.id)
      }, 500)

    } catch (error) {
      console.error('Recognition error:', error)
      setLines(lines.map(l => 
        l.id === line.id ? { ...l, isProcessing: false } : l
      ))
    }
  }

  const simulateOCR = async (line: HandwritingLine): Promise<string> => {
    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo, return sample text
    const sampleTexts = [
      "Le prof a dit que c'est important pour l'exam",
      "Formule: E = mc², ne pas oublier",
      "TD demain à 14h, réviser chapitre 3",
      "Déf: La thermodynamique est l'étude des transferts d'énergie"
    ]
    
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
  }

  const expandAbbreviations = (text: string): string => {
    const words = text.split(' ')
    return words.map(word => {
      const expansions = tagsAI.expandAbbreviation(word, 'current-user')
      return expansions.length > 0 ? expansions[0] : word
    }).join(' ')
  }

  const correctSpelling = async (text: string): Promise<string> => {
    // TODO: Integrate real spell checker
    return text
  }

  const animateLineDisappear = (lineId: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Fade out animation
    const line = lines.find(l => l.id === lineId)
    if (!line) return

    // Move line to background
    setLines(lines.filter(l => l.id !== lineId))
  }

  const eraseAt = (point: { x: number; y: number }) => {
    // Erase strokes near the point
    const eraseRadius = 20
    
    setLines(lines.map(line => ({
      ...line,
      strokes: line.strokes.map(stroke => ({
        ...stroke,
        points: stroke.points.filter(p => {
          const distance = Math.sqrt(
            Math.pow(p.x - point.x, 2) + 
            Math.pow(p.y - point.y, 2)
          )
          return distance > eraseRadius
        })
      })).filter(stroke => stroke.points.length > 0)
    })).filter(line => line.strokes.length > 0))
  }

  const handleResize = (e: React.MouseEvent, direction: 'horizontal' | 'vertical' | 'both') => {
    e.preventDefault()
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = containerRef.current?.offsetWidth || 0
    const startHeight = containerRef.current?.offsetHeight || 0

    const handleMouseMove = (e: MouseEvent) => {
      if (direction === 'horizontal' || direction === 'both') {
        const newWidth = startWidth + (e.clientX - startX)
        setUserPreferredSize(prev => ({ 
          ...prev, 
          width: `${Math.max(300, newWidth)}px` 
        }))
      }
      
      if (direction === 'vertical' || direction === 'both') {
        const newHeight = startHeight + (e.clientY - startY)
        setUserPreferredSize(prev => ({ 
          ...prev, 
          height: `${Math.max(200, newHeight)}px` 
        }))
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleVoiceTranscription = (text: string) => {
    // Ajouter le texte transcrit aux notes reconnues
    setRecognizedNotes([...recognizedNotes, text])
    
    // Créer une ligne visuelle pour le texte vocal
    const voiceLine: HandwritingLine = {
      id: Date.now().toString(),
      strokes: [],
      recognizedText: text,
      timestamp: new Date()
    }
    
    setLines([...lines, voiceLine])
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <motion.div
        ref={containerRef}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative mx-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-t-2xl overflow-hidden"
        style={{
          width: userPreferredSize.width,
          height: userPreferredSize.height,
          maxWidth: '95vw',
          minWidth: '300px',
          minHeight: '200px'
        }}
      >
        {/* Resize handles */}
        <div
          className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-white/10 transition-colors"
          onMouseDown={(e) => handleResize(e, 'vertical')}
        />
        <div
          className="absolute top-0 left-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/10 transition-colors"
          onMouseDown={(e) => handleResize(e, 'horizontal')}
        />
        <div
          className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/10 transition-colors"
          onMouseDown={(e) => handleResize(e, 'horizontal')}
        />
        <div
          className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize hover:bg-white/20 transition-colors"
          onMouseDown={(e) => handleResize(e, 'both')}
        />
        <div
          className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize hover:bg-white/20 transition-colors"
          onMouseDown={(e) => handleResize(e, 'both')}
        />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur border-b border-white/10 p-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            {/* Mode buttons */}
            <button
              onClick={() => setSettings({ ...settings, mode: 'pen' })}
              className={cn(
                "p-2 rounded-lg transition-all",
                settings.mode === 'pen' 
                  ? "bg-purple-600 text-white" 
                  : "hover:bg-white/10 text-gray-400"
              )}
            >
              <Pen className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setSettings({ ...settings, mode: 'eraser' })}
              className={cn(
                "p-2 rounded-lg transition-all",
                settings.mode === 'eraser' 
                  ? "bg-purple-600 text-white" 
                  : "hover:bg-white/10 text-gray-400"
              )}
            >
              <Eraser className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setSettings({ ...settings, mode: 'text' })}
              className={cn(
                "p-2 rounded-lg transition-all",
                settings.mode === 'text' 
                  ? "bg-purple-600 text-white" 
                  : "hover:bg-white/10 text-gray-400"
              )}
            >
              <Type className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setSettings({ ...settings, mode: 'voice' })}
              className={cn(
                "p-2 rounded-lg transition-all",
                settings.mode === 'voice' 
                  ? "bg-purple-600 text-white" 
                  : "hover:bg-white/10 text-gray-400"
              )}
            >
              <Mic className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-white/20" />

            {/* Color picker - only show for pen mode */}
            {settings.mode === 'pen' && (
              <>
                <input
                  type="color"
                  value={settings.penColor}
                  onChange={(e) => setSettings({ ...settings, penColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent"
                />

                {/* Pen width */}
                <select
                  value={settings.penWidth}
                  onChange={(e) => setSettings({ ...settings, penWidth: Number(e.target.value) })}
                  className="bg-white/10 text-white text-sm px-2 py-1 rounded"
                >
                  <option value="1">Fin</option>
                  <option value="2">Normal</option>
                  <option value="3">Épais</option>
                  <option value="5">Très épais</option>
                </select>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Grid toggle */}
            <button
              onClick={() => setSettings({ ...settings, showGrid: !settings.showGrid })}
              className={cn(
                "p-2 rounded-lg transition-all",
                settings.showGrid ? "text-purple-400" : "text-gray-400"
              )}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>

            {/* Show recognized text */}
            <button
              onClick={() => setShowRecognizedPanel(!showRecognizedPanel)}
              className={cn(
                "p-2 rounded-lg transition-all",
                showRecognizedPanel ? "text-purple-400" : "text-gray-400"
              )}
            >
              {showRecognizedPanel ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Clear canvas */}
            <button
              onClick={() => {
                setLines([])
                setCurrentLine(null)
                setRecognizedNotes([])
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas - hide when in voice mode */}
        {settings.mode !== 'voice' && (
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height - 60}
            className="absolute top-[60px] left-0 cursor-crosshair"
            style={{ 
              touchAction: 'none',
              cursor: settings.mode === 'eraser' ? 'grab' : 
                      settings.mode === 'text' ? 'text' : 'crosshair'
            }}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={endDrawing}
            onPointerLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        )}

        {/* Voice mode UI */}
        {settings.mode === 'voice' && (
          <div className="absolute top-[60px] left-0 right-0 bottom-0 flex flex-col items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Mode Vocal</h3>
              <p className="text-gray-400 mb-8">
                Parle clairement et utilise les commandes vocales
              </p>
              
              <VoiceRecorder
                onTranscription={handleVoiceTranscription}
                expandAbbreviations={settings.expandAbbreviations}
                correctSpelling={settings.correctSpelling}
              />
              
              <div className="mt-8 p-4 bg-white/5 rounded-lg max-w-md">
                <h4 className="text-sm font-semibold text-white mb-2">Commandes vocales:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div>"point" → .</div>
                  <div>"virgule" → ,</div>
                  <div>"nouvelle ligne" → ↵</div>
                  <div>"point d'interrogation" → ?</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Text mode UI */}
        {settings.mode === 'text' && (
          <div className="absolute top-[60px] left-0 right-0 bottom-0 p-4">
            <textarea
              className="w-full h-full bg-transparent text-white p-4 resize-none focus:outline-none"
              placeholder="Tape ton texte ici... (Tab pour étendre les abréviations)"
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault()
                  const textarea = e.target as HTMLTextAreaElement
                  const cursorPosition = textarea.selectionStart
                  const textBeforeCursor = textarea.value.substring(0, cursorPosition)
                  const words = textBeforeCursor.split(/\s+/)
                  const lastWord = words[words.length - 1]
                  
                  if (lastWord) {
                    const expansions = tagsAI.expandAbbreviation(lastWord, 'current-user')
                    if (expansions.length > 0) {
                      const newText = 
                        textarea.value.substring(0, cursorPosition - lastWord.length) +
                        expansions[0] +
                        textarea.value.substring(cursorPosition)
                      
                      textarea.value = newText
                      const newPosition = cursorPosition - lastWord.length + expansions[0].length
                      textarea.setSelectionRange(newPosition, newPosition)
                    }
                  }
                }
              }}
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  handleVoiceTranscription(e.target.value)
                  e.target.value = ''
                }
              }}
              style={{
                fontFamily: 'monospace',
                fontSize: '16px',
                lineHeight: '1.5'
              }}
            />
          </div>
        )}

        {/* Recognized text panel */}
        <AnimatePresence>
          {showRecognizedPanel && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute right-0 top-[60px] bottom-0 w-80 bg-black/80 border-l border-white/10 p-4 overflow-y-auto z-10"
            >
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes reconnues
              </h3>
              
              <div className="space-y-2">
                {recognizedNotes.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Écris quelque chose pour commencer...
                  </p>
                ) : (
                  recognizedNotes.map((note, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-white/5 rounded-lg text-sm text-gray-300 group relative"
                    >
                      {note}
                      
                      {/* Copy button */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(note)
                          toast.success('Note copiée!')
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {recognizedNotes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <button 
                    onClick={() => {
                      const allNotes = recognizedNotes.join('\n\n')
                      navigator.clipboard.writeText(allNotes)
                      toast.success('Toutes les notes copiées!')
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copier tout
                  </button>
                  
                  <button 
                    onClick={() => {
                      const allNotes = recognizedNotes.join('\n\n')
                      const blob = new Blob([allNotes], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `notes-${new Date().toISOString().slice(0, 10)}.txt`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Exporter les notes
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 p-4 z-20"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.autoRecognize}
                    onChange={(e) => setSettings({ ...settings, autoRecognize: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-gray-300">Reconnaissance auto</span>
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.expandAbbreviations}
                    onChange={(e) => setSettings({ ...settings, expandAbbreviations: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-gray-300">Étendre abréviations</span>
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.correctSpelling}
                    onChange={(e) => setSettings({ ...settings, correctSpelling: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-gray-300">Corriger orthographe</span>
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-gray-300">Délai: {settings.recognitionDelay}ms</span>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="500"
                    value={settings.recognitionDelay}
                    onChange={(e) => setSettings({ ...settings, recognitionDelay: Number(e.target.value) })}
                    className="w-20"
                  />
                </label>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-2">Taille de la fenêtre:</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setUserPreferredSize({ width: '40%', height: '400px' })}
                    className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                  >
                    Petit
                  </button>
                  <button
                    onClick={() => setUserPreferredSize({ width: '60%', height: '500px' })}
                    className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                  >
                    Moyen
                  </button>
                  <button
                    onClick={() => setUserPreferredSize({ width: '80%', height: '600px' })}
                    className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                  >
                    Grand
                  </button>
                  <button
                    onClick={() => setUserPreferredSize({ width: '95%', height: '80vh' })}
                    className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition-colors"
                  >
                    Plein écran
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing indicator */}
        {lines.some(l => l.isProcessing) && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-purple-600/20 border border-purple-600/40 rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
              <span className="text-sm text-purple-400">Reconnaissance en cours...</span>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}