'use client'

import { useEffect } from 'react'

export function useVoiceCommand(phrase: string, callback: () => void) {
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'fr-FR'

    const handleResult = (event: SpeechRecognitionEvent) => {
      for (const result of event.results) {
        const transcript = result[0].transcript.trim().toLowerCase()
        if (transcript.includes(phrase.toLowerCase())) {
          callback()
        }
      }
    }

    recognition.addEventListener('result', handleResult)
    recognition.start()

    return () => {
      recognition.removeEventListener('result', handleResult)
      recognition.stop()
    }
  }, [phrase, callback])
}
