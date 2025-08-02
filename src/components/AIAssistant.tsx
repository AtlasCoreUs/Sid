import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import type { AIAnalysis } from '../types';

interface AIAssistantProps {
  noteId: string;
  isVisible: boolean;
  onClose: () => void;
}

export function AIAssistant({ noteId, isVisible, onClose }: AIAssistantProps): React.ReactElement | null {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { getNoteById, setAIAnalysis, aiAnalysis } = useAppStore();
  const note = getNoteById(noteId);
  const analysis = aiAnalysis[noteId];

  const analyzeNote = async (): Promise<void> => {
    if (!note) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulation d'analyse IA avancée
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sentiment = note.content.includes('excellent') || note.content.includes('génial') 
        ? 'positive' 
        : note.content.includes('problème') || note.content.includes('difficile')
        ? 'negative'
        : 'neutral';
      
      const keywords = note.content
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 5);
      
      const complexity = note.content.length > 1000 ? 'hard' : note.content.length > 500 ? 'medium' : 'easy';
      
      const aiAnalysis: AIAnalysis = {
        sentiment,
        keywords,
        summary: `Note de ${note.content.length} caractères avec ${note.content.split(/\s+/).length} mots`,
        readingTime: Math.ceil(note.content.split(/\s+/).length / 200),
        complexity,
        suggestions: [
          'Considérez ajouter des sous-titres pour améliorer la structure',
          'Ajoutez des liens vers d\'autres notes connexes',
          'Utilisez des listes à puces pour les points importants',
          'Incluez des exemples concrets pour clarifier vos idées',
        ],
        language: 'fr',
      };
      
      setAIAnalysis(noteId, aiAnalysis);
      setSuggestions(aiAnalysis.suggestions);
    } catch (error) {
      console.error('Erreur lors de l\'analyse IA:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateContent = async (prompt: string): Promise<void> => {
    setIsGenerating(true);
    
    try {
      // Simulation de génération de contenu IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generated = `Contenu généré basé sur: "${prompt}"

## Points clés
- Analyse approfondie du sujet
- Recommandations pratiques
- Exemples concrets

## Actions suggérées
1. Définir les objectifs clairs
2. Établir un plan d'action
3. Mesurer les résultats

## Notes importantes
* À personnaliser selon vos besoins
* À adapter au contexte spécifique
* À réviser régulièrement`;
      
      setGeneratedContent(generated);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isVisible && note && !analysis) {
      analyzeNote();
    }
  }, [isVisible, note, analysis]);

  if (!isVisible || !note) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        style={{ position: 'fixed', right: 0, top: 0, width: '400px', height: '100vh', backgroundColor: 'var(--dark-secondary)', borderLeft: '1px solid var(--border-dark)', boxShadow: 'var(--shadow-lg)', zIndex: 1001, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        <div className="ai-header">
          <h3>🤖 Assistant IA</h3>
          <button onClick={onClose} className="ai-close-btn">×</button>
        </div>

        <div className="ai-content">
          {isAnalyzing ? (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              <p>Analyse en cours...</p>
            </div>
          ) : analysis ? (
            <div className="ai-analysis">
              <div className="ai-section">
                <h4>📊 Analyse</h4>
                <div className="ai-stats">
                  <div className="ai-stat">
                    <span className="ai-stat-label">Sentiment:</span>
                    <span className={`ai-stat-value sentiment-${analysis.sentiment}`}>
                      {analysis.sentiment === 'positive' ? '😊 Positif' : 
                       analysis.sentiment === 'negative' ? '😔 Négatif' : '😐 Neutre'}
                    </span>
                  </div>
                  <div className="ai-stat">
                    <span className="ai-stat-label">Complexité:</span>
                    <span className={`ai-stat-value complexity-${analysis.complexity}`}>
                      {analysis.complexity === 'easy' ? 'Facile' : 
                       analysis.complexity === 'medium' ? 'Moyen' : 'Difficile'}
                    </span>
                  </div>
                  <div className="ai-stat">
                    <span className="ai-stat-label">Temps de lecture:</span>
                    <span className="ai-stat-value">{analysis.readingTime} min</span>
                  </div>
                </div>
              </div>

              <div className="ai-section">
                <h4>🔑 Mots-clés</h4>
                <div className="ai-keywords">
                  {analysis.keywords.map((keyword, index) => (
                    <span key={index} className="ai-keyword">{keyword}</span>
                  ))}
                </div>
              </div>

              <div className="ai-section">
                <h4>💡 Suggestions</h4>
                <ul className="ai-suggestions">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="ai-suggestion">{suggestion}</li>
                  ))}
                </ul>
              </div>

              <div className="ai-section">
                <h4>✨ Génération de contenu</h4>
                <div className="ai-generator">
                  <textarea
                    ref={textareaRef}
                    placeholder="Décrivez ce que vous voulez générer..."
                    className="ai-prompt-input"
                    rows={3}
                  />
                  <button
                    onClick={() => generateContent(textareaRef.current?.value || '')}
                    disabled={isGenerating}
                    className="ai-generate-btn"
                  >
                    {isGenerating ? 'Génération...' : 'Générer'}
                  </button>
                </div>
                
                {generatedContent && (
                  <div className="ai-generated">
                    <h5>Contenu généré:</h5>
                    <pre className="ai-generated-content">{generatedContent}</pre>
                    <button className="ai-copy-btn">Copier</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="ai-error">
              <p>Impossible d'analyser cette note</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}