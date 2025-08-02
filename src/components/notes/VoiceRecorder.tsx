'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Square,
  Volume2,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StudyTagsAI } from '@/lib/student/study-tags-system'
import toast from 'react-hot-toast'

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  expandAbbreviations?: boolean
  correctSpelling?: boolean
}

export default function VoiceRecorder({ 
  onTranscription, 
  expandAbbreviations = true,
  correctSpelling = false 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [transcribedText, setTranscribedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const tagsAI = useRef(new StudyTagsAI()).current

  // Web Speech API pour transcription temps réel
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialiser Web Speech API
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'fr-FR'
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }
        
        if (finalTranscript) {
          processTranscription(finalTranscript)
        }
        
        setTranscribedText(prev => prev + finalTranscript + interimTranscript)
      }
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech') {
          toast.error('Aucune voix détectée. Parle plus fort.')
        }
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const processTranscription = async (text: string) => {
    let processedText = text
    
    // Détecter et étendre les abréviations
    if (expandAbbreviations) {
      const words = text.split(' ')
      processedText = words.map(word => {
        const expansions = tagsAI.expandAbbreviation(word.toLowerCase(), 'current-user')
        return expansions.length > 0 ? expansions[0] : word
      }).join(' ')
    }
    
    // Corriger l'orthographe si activé
    if (correctSpelling) {
      // TODO: Intégrer correcteur orthographique
    }
    
    // Détecter les commandes vocales
    const commands = detectVoiceCommands(processedText)
    if (commands.length > 0) {
      handleVoiceCommands(commands)
      // Retirer les commandes du texte
      commands.forEach(cmd => {
        processedText = processedText.replace(cmd.match, '')
      })
    }
    
    onTranscription(processedText.trim())
  }

  const detectVoiceCommands = (text: string): Array<{command: string, match: string}> => {
    const commands = []
    
    // Commandes de ponctuation
    const punctuationCommands = {
      'point': '.',
      'virgule': ',',
      'point virgule': ';',
      'deux points': ':',
      'point d\'interrogation': '?',
      'point d\'exclamation': '!',
      'ouvrez parenthèse': '(',
      'fermez parenthèse': ')',
      'ouvrez guillemet': '"',
      'fermez guillemet': '"',
      'nouvelle ligne': '\n',
      'nouveau paragraphe': '\n\n'
    }
    
    for (const [spoken, symbol] of Object.entries(punctuationCommands)) {
      const regex = new RegExp(`\\b${spoken}\\b`, 'gi')
      const matches = text.match(regex)
      if (matches) {
        matches.forEach(match => {
          commands.push({ command: symbol, match })
        })
      }
    }
    
    return commands
  }

  const handleVoiceCommands = (commands: Array<{command: string, match: string}>) => {
    commands.forEach(({ command }) => {
      onTranscription(command)
    })
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      streamRef.current = stream
      
      // Setup audio analyser pour visualisation
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256
      
      // Start visualizing audio levels
      visualizeAudio()
      
      // Setup MediaRecorder pour backup
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorderRef.current.start()
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
      
      setIsRecording(true)
      toast.success('Enregistrement démarré. Parle clairement.')
      
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('Impossible d\'accéder au microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      setIsRecording(false)
      setAudioLevel(0)
      
      // Process final audio if needed
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        // Could send to server for more accurate transcription
      }
    }
  }

  const togglePause = () => {
    if (isPaused) {
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
      visualizeAudio()
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
    setIsPaused(!isPaused)
  }

  const visualizeAudio = () => {
    if (!analyserRef.current) return
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const animate = () => {
      if (!analyserRef.current) return
      
      analyserRef.current.getByteFrequencyData(dataArray)
      
      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(average / 255)
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
  }

  return (
    <div className="flex items-center gap-4">
      {/* Main record button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          "relative p-4 rounded-full transition-all",
          isRecording 
            ? "bg-red-600 hover:bg-red-700" 
            : "bg-purple-600 hover:bg-purple-700"
        )}
      >
        {isRecording ? (
          <Square className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
        
        {/* Audio level indicator */}
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-white/30"
            animate={{
              scale: 1 + audioLevel * 0.5,
              opacity: 0.3 + audioLevel * 0.7
            }}
            transition={{ duration: 0.1 }}
          />
        )}
      </motion.button>

      {/* Pause button */}
      {isRecording && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={togglePause}
          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
        >
          {isPaused ? (
            <Play className="w-5 h-5 text-white" />
          ) : (
            <Pause className="w-5 h-5 text-white" />
          )}
        </motion.button>
      )}

      {/* Status indicator */}
      <div className="flex items-center gap-2">
        {isRecording && (
          <>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"
            )} />
            <span className="text-sm text-gray-300">
              {isPaused ? 'En pause' : 'Enregistrement...'}
            </span>
          </>
        )}
        
        {isProcessing && (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span className="text-sm text-gray-300">Transcription...</span>
          </>
        )}
      </div>

      {/* Audio level bars */}
      {isRecording && !isPaused && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          className="flex items-center gap-1"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-purple-400 rounded-full"
              animate={{
                height: audioLevel > (i / 5) ? `${10 + i * 4}px` : '4px',
                opacity: audioLevel > (i / 5) ? 1 : 0.3
              }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </motion.div>
      )}

      {/* Voice commands hint */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-gray-500"
        >
          💡 Dis "virgule", "point", "nouvelle ligne"...
        </motion.div>
      )}
    </div>
  )
}