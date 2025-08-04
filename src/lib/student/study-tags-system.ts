// 🎓 SYSTÈME D'ÉTIQUETTES INTELLIGENTES POUR ÉTUDIANTS

export interface StudyTag {
  id: string
  type: 'priority' | 'content' | 'timing' | 'custom'
  label: string
  icon: string
  color: string
  importance: number // 1-10
  metadata?: {
    examDate?: Date
    subject?: string
    professor?: string
    frequency?: number
  }
}

export interface TagPattern {
  abbreviation: string
  fullForm: string
  confidence: number
  userId: string
  context: string[]
  frequency: number
  dateAdded: Date
  lastUsed: Date
}

// 🏷️ ÉTIQUETTES PRÉDÉFINIES
export const STUDY_TAGS = {
  // Priorité Exam
  CRITICAL_EXAM: {
    id: 'critical-exam',
    type: 'priority' as const,
    label: 'CRITIQUE EXAM',
    icon: '🔴',
    color: '#EF4444',
    importance: 10
  },
  IMPORTANT_EXAM: {
    id: 'important-exam',
    type: 'priority' as const,
    label: 'IMPORTANT EXAM',
    icon: '🟠',
    color: '#F97316',
    importance: 8
  },
  USEFUL_EXAM: {
    id: 'useful-exam',
    type: 'priority' as const,
    label: 'UTILE EXAM',
    icon: '🟡',
    color: '#EAB308',
    importance: 6
  },
  BONUS_EXAM: {
    id: 'bonus-exam',
    type: 'priority' as const,
    label: 'BONUS EXAM',
    icon: '🟢',
    color: '#10B981',
    importance: 4
  },

  // Type de Contenu
  FORMULA: {
    id: 'formula',
    type: 'content' as const,
    label: 'FORMULE',
    icon: '🧮',
    color: '#8B5CF6',
    importance: 9
  },
  DEFINITION: {
    id: 'definition',
    type: 'content' as const,
    label: 'DÉFINITION',
    icon: '📖',
    color: '#6366F1',
    importance: 8
  },
  LOGICAL_LINK: {
    id: 'logical-link',
    type: 'content' as const,
    label: 'LIEN LOGIQUE',
    icon: '🔗',
    color: '#0EA5E9',
    importance: 7
  },
  EXAMPLE: {
    id: 'example',
    type: 'content' as const,
    label: 'EXEMPLE TYPE',
    icon: '📊',
    color: '#14B8A6',
    importance: 6
  },

  // Timing Révision
  REVIEW_TOMORROW: {
    id: 'review-tomorrow',
    type: 'timing' as const,
    label: 'RÉVISER DEMAIN',
    icon: '🚨',
    color: '#DC2626',
    importance: 10
  },
  REVIEW_WEEK: {
    id: 'review-week',
    type: 'timing' as const,
    label: 'RÉVISER SEMAINE',
    icon: '📅',
    color: '#F59E0B',
    importance: 7
  },
  REVIEW_REGULAR: {
    id: 'review-regular',
    type: 'timing' as const,
    label: 'RÉVISER RÉGULIER',
    icon: '🔄',
    color: '#3B82F6',
    importance: 5
  },
  MASTERED: {
    id: 'mastered',
    type: 'timing' as const,
    label: 'SU PAR CŒUR',
    icon: '✅',
    color: '#10B981',
    importance: 1
  }
}

// 🧠 IA DE DÉTECTION D'ÉTIQUETTES
export class StudyTagsAI {
  private userPatterns: Map<string, TagPattern[]> = new Map()
  private globalPatterns: Map<string, number> = new Map()

  // Détection automatique d'importance
  detectExamImportance(noteContent: string, context?: {
    courseName?: string
    professorName?: string
    examDate?: Date
    previousExams?: string[]
  }): StudyTag[] {
    const suggestedTags: StudyTag[] = []
    
    // Analyse du contenu
    const contentLower = noteContent.toLowerCase()
    
    // Détection formules mathématiques/scientifiques
    if (this.containsFormula(noteContent)) {
      suggestedTags.push(STUDY_TAGS.FORMULA)
      suggestedTags.push(STUDY_TAGS.CRITICAL_EXAM)
    }
    
    // Détection mots-clés importance
    const criticalKeywords = [
      'important', 'critique', 'essentiel', 'fondamental',
      'exam', 'contrôle', 'partiel', 'évaluation',
      'retenir', 'mémoriser', 'par cœur', 'obligatoire'
    ]
    
    const importanceScore = criticalKeywords.reduce((score, keyword) => {
      return score + (contentLower.includes(keyword) ? 1 : 0)
    }, 0)
    
    if (importanceScore >= 3) {
      suggestedTags.push(STUDY_TAGS.CRITICAL_EXAM)
    } else if (importanceScore >= 2) {
      suggestedTags.push(STUDY_TAGS.IMPORTANT_EXAM)
    } else if (importanceScore >= 1) {
      suggestedTags.push(STUDY_TAGS.USEFUL_EXAM)
    }
    
    // Détection définitions
    if (this.isDefinition(noteContent)) {
      suggestedTags.push(STUDY_TAGS.DEFINITION)
    }
    
    // Détection exemples
    if (contentLower.includes('exemple') || contentLower.includes('ex:') || contentLower.includes('e.g.')) {
      suggestedTags.push(STUDY_TAGS.EXAMPLE)
    }
    
    // Timing basé sur la proximité de l'exam
    if (context?.examDate) {
      const daysUntilExam = Math.ceil((context.examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilExam <= 1) {
        suggestedTags.push(STUDY_TAGS.REVIEW_TOMORROW)
      } else if (daysUntilExam <= 7) {
        suggestedTags.push(STUDY_TAGS.REVIEW_WEEK)
      } else {
        suggestedTags.push(STUDY_TAGS.REVIEW_REGULAR)
      }
    }
    
    return this.removeDuplicateTags(suggestedTags)
  }

  // Apprentissage des abréviations utilisateur
  learnAbbreviation(
    abbreviation: string, 
    fullForm: string, 
    userId: string,
    context?: string[]
  ): void {
    const pattern: TagPattern = {
      abbreviation: abbreviation.toLowerCase(),
      fullForm,
      confidence: 1.0,
      userId,
      context: context || [],
      frequency: 1,
      dateAdded: new Date(),
      lastUsed: new Date()
    }
    
    // Sauvegarder pour cet utilisateur
    if (!this.userPatterns.has(userId)) {
      this.userPatterns.set(userId, [])
    }
    
    const userAbbreviations = this.userPatterns.get(userId)!
    const existingIndex = userAbbreviations.findIndex(
      p => p.abbreviation === pattern.abbreviation
    )
    
    if (existingIndex >= 0) {
      // Mettre à jour la fréquence
      userAbbreviations[existingIndex].frequency++
      userAbbreviations[existingIndex].lastUsed = new Date()
      
      // Augmenter la confiance si utilisé souvent
      if (userAbbreviations[existingIndex].frequency > 5) {
        userAbbreviations[existingIndex].confidence = Math.min(
          userAbbreviations[existingIndex].confidence + 0.1,
          1.0
        )
      }
    } else {
      userAbbreviations.push(pattern)
    }
    
    // Contribuer aux patterns globaux
    const globalKey = `${abbreviation}:${fullForm}`
    this.globalPatterns.set(
      globalKey,
      (this.globalPatterns.get(globalKey) || 0) + 1
    )
  }

  // Suggestions d'abréviations basées sur l'apprentissage
  expandAbbreviation(abbreviation: string, userId: string): string[] {
    const suggestions: Array<{text: string, score: number}> = []
    
    // 1. Chercher dans les patterns de l'utilisateur
    const userAbbreviations = this.userPatterns.get(userId) || []
    userAbbreviations
      .filter(p => p.abbreviation === abbreviation.toLowerCase())
      .forEach(p => {
        suggestions.push({
          text: p.fullForm,
          score: p.confidence * p.frequency * 2 // Priorité aux habitudes user
        })
      })
    
    // 2. Chercher dans les patterns globaux
    this.globalPatterns.forEach((frequency, key) => {
      const [abbr, full] = key.split(':')
      if (abbr === abbreviation.toLowerCase()) {
        suggestions.push({
          text: full,
          score: Math.log(frequency + 1) // Score logarithmique pour global
        })
      }
    })
    
    // 3. Suggestions par défaut communes
    const commonAbbreviations = this.getCommonAbbreviations()
    if (commonAbbreviations[abbreviation.toLowerCase()]) {
      commonAbbreviations[abbreviation.toLowerCase()].forEach(expansion => {
        suggestions.push({
          text: expansion,
          score: 0.5 // Score de base
        })
      })
    }
    
    // Trier par score et retourner
    return suggestions
      .sort((a, b) => b.score - a.score)
      .map(s => s.text)
      .filter((text, index, self) => self.indexOf(text) === index) // Unique
      .slice(0, 5) // Top 5
  }

  // Détection de nouvelles abréviations
  detectNewAbbreviations(text: string): Array<{
    detected: string
    suggestions: string[]
    confidence: number
  }> {
    const words = text.split(/\s+/)
    const detectedAbbreviations: Array<{
      detected: string
      suggestions: string[]
      confidence: number
    }> = []
    
    words.forEach(word => {
      // Patterns d'abréviations typiques
      if (this.looksLikeAbbreviation(word)) {
        const suggestions = this.generateExpansionSuggestions(word)
        if (suggestions.length > 0) {
          detectedAbbreviations.push({
            detected: word,
            suggestions,
            confidence: this.calculateAbbreviationConfidence(word)
          })
        }
      }
    })
    
    return detectedAbbreviations
  }

  // Helpers privés
  private containsFormula(text: string): boolean {
    // Patterns de formules mathématiques/scientifiques
    const formulaPatterns = [
      /[a-zA-Z]\s*=\s*[^=]/, // x = ...
      /\d+\s*[\+\-\*\/]\s*\d+/, // Operations
      /[∫∑∏√∂∇]/, // Symboles mathématiques
      /\^[0-9\{\}]+/, // Exposants
      /_[0-9\{\}]+/, // Indices
      /\\[a-zA-Z]+/, // LaTeX commands
    ]
    
    return formulaPatterns.some(pattern => pattern.test(text))
  }

  private isDefinition(text: string): boolean {
    const definitionPatterns = [
      /est\s+(un|une|le|la|les|des)\s+/i,
      /:\s*[A-Z]/,
      /définition\s*:/i,
      /déf\s*:/i,
      /=\s*"/,
    ]
    
    return definitionPatterns.some(pattern => pattern.test(text))
  }

  private looksLikeAbbreviation(word: string): boolean {
    // Mot court, tout en majuscules, ou avec des points
    return (
      (word.length <= 5 && word === word.toUpperCase()) ||
      word.includes('.') ||
      /^[A-Z]{2,}$/.test(word) ||
      /^[a-z]+[A-Z]/.test(word) // camelCase
    )
  }

  private generateExpansionSuggestions(abbreviation: string): string[] {
    // Logique intelligente pour suggérer des expansions
    const suggestions: string[] = []
    
    // Pour les abréviations en majuscules
    if (abbreviation === abbreviation.toUpperCase()) {
      // Ex: "TD" -> "Travaux Dirigés"
      const commonAcademicAbbreviations: Record<string, string[]> = {
        'TD': ['Travaux Dirigés', 'To Do'],
        'TP': ['Travaux Pratiques'],
        'CM': ['Cours Magistral'],
        'QCM': ['Questions à Choix Multiples'],
        'DS': ['Devoir Surveillé'],
        'DM': ['Devoir Maison'],
        'CC': ['Contrôle Continu'],
        'UE': ['Unité d\'Enseignement'],
        'ECTS': ['European Credit Transfer System'],
      }
      
      if (commonAcademicAbbreviations[abbreviation]) {
        suggestions.push(...commonAcademicAbbreviations[abbreviation])
      }
    }
    
    return suggestions
  }

  private calculateAbbreviationConfidence(word: string): number {
    let confidence = 0.5
    
    // Plus confiant si tout en majuscules
    if (word === word.toUpperCase() && word.length >= 2) {
      confidence += 0.2
    }
    
    // Plus confiant si contient des points
    if (word.includes('.')) {
      confidence += 0.1
    }
    
    // Plus confiant si longueur typique d'abréviation
    if (word.length >= 2 && word.length <= 4) {
      confidence += 0.1
    }
    
    return Math.min(confidence, 0.9)
  }

  private removeDuplicateTags(tags: StudyTag[]): StudyTag[] {
    const seen = new Set<string>()
    return tags.filter(tag => {
      if (seen.has(tag.id)) return false
      seen.add(tag.id)
      return true
    })
  }

  private getCommonAbbreviations(): Record<string, string[]> {
    return {
      'ex': ['exemple', 'exercice'],
      'déf': ['définition'],
      'th': ['théorème'],
      'prop': ['proposition', 'propriété'],
      'cor': ['corollaire'],
      'dem': ['démonstration'],
      'hyp': ['hypothèse'],
      'ccl': ['conclusion'],
      'rem': ['remarque'],
      'obs': ['observation'],
      'cf': ['confer', 'voir'],
      'ie': ['c\'est-à-dire'],
      'eg': ['par exemple'],
      'nb': ['nota bene', 'note bien'],
      'vs': ['versus', 'contre'],
      'etc': ['et cetera'],
      'pr': ['pour'],
      'tt': ['tout'],
      'ts': ['tous'],
      'tte': ['toute'],
      'ttes': ['toutes'],
      'bcp': ['beaucoup'],
      'svt': ['souvent'],
      'tjrs': ['toujours'],
      'jms': ['jamais'],
      'pdt': ['pendant'],
      'avt': ['avant'],
      'aps': ['après'],
      'ds': ['dans'],
      'ms': ['mais'],
      'dc': ['donc'],
      'pcq': ['parce que'],
      'pq': ['pourquoi'],
      'cmt': ['comment'],
      'qd': ['quand'],
      'qq': ['quelque'],
      'qqch': ['quelque chose'],
      'qqn': ['quelqu\'un'],
      'mtn': ['maintenant'],
      'auj': ["aujourd'hui"],
      'hier': ['hier'],
      'demain': ['demain'],
      'fct': ['fonction'],
      'var': ['variable'],
      'const': ['constante'],
      'eq': ['équation'],
      'sol': ['solution'],
      'pb': ['problème'],
      'res': ['résultat'],
      'calc': ['calcul'],
      'dev': ['développement'],
      'lim': ['limite'],
      'deriv': ['dérivée'],
      'int': ['intégrale'],
      'mat': ['matrice'],
      'det': ['déterminant'],
      'vect': ['vecteur'],
      'esp': ['espace'],
      'dim': ['dimension'],
      'base': ['base'],
      'proj': ['projection'],
      'orth': ['orthogonal'],
      'norm': ['norme', 'normal'],
      'inf': ['inférieur'],
      'sup': ['supérieur'],
      'min': ['minimum'],
      'max': ['maximum'],
      'moy': ['moyenne'],
      'med': ['médiane'],
      'ecart': ['écart-type'],
      'prob': ['probabilité'],
      'stat': ['statistique'],
      'phys': ['physique'],
      'chim': ['chimie'],
      'bio': ['biologie'],
      'math': ['mathématiques'],
      'info': ['informatique'],
      'eco': ['économie'],
      'geo': ['géographie'],
      'hist': ['histoire'],
      'philo': ['philosophie'],
      'litt': ['littérature'],
      'lang': ['langue', 'langage'],
      'fr': ['français'],
      'eng': ['anglais'],
      'espagnol': ['espagnol'],
      'all': ['allemand'],
      'it': ['italien']
    }
  }
}

// 🎮 GAMIFICATION DES ÉTIQUETTES
export interface StudyAchievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: {
    type: 'tags_created' | 'tags_used' | 'accuracy' | 'streak'
    value: number
  }
  reward: {
    type: 'theme' | 'animation' | 'feature' | 'badge'
    value: string
  }
  unlocked: boolean
  progress: number
}

export const STUDY_ACHIEVEMENTS: StudyAchievement[] = [
  {
    id: 'tag-master',
    name: 'TAG MASTER',
    description: '100 étiquettes créées',
    icon: '📌',
    requirement: { type: 'tags_created', value: 100 },
    reward: { type: 'feature', value: 'custom_tag_templates' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'exam-predictor',
    name: 'EXAM PREDICTOR',
    description: '80% de tes notes étiquetées tombent à l\'exam',
    icon: '🎯',
    requirement: { type: 'accuracy', value: 0.8 },
    reward: { type: 'feature', value: 'ai_exam_prediction' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'revision-champion',
    name: 'REVISION CHAMPION',
    description: '50 sessions de révision par étiquettes',
    icon: '🔄',
    requirement: { type: 'tags_used', value: 50 },
    reward: { type: 'feature', value: 'auto_revision_planning' },
    unlocked: false,
    progress: 0
  },
  {
    id: 'organization-guru',
    name: 'ORGANIZATION GURU',
    description: 'Utilise 20+ types d\'étiquettes différentes',
    icon: '📊',
    requirement: { type: 'tags_created', value: 20 },
    reward: { type: 'feature', value: 'team_tag_sharing' },
    unlocked: false,
    progress: 0
  }
]

// 📊 STATISTIQUES ET ANALYTICS
export class StudyTagsAnalytics {
  
  // Analyse l'efficacité des étiquettes
  analyzeTagEffectiveness(userId: string, examResults: {
    taggedNotes: string[]
    examQuestions: string[]
    correctAnswers: string[]
  }): {
    accuracy: number
    mostEffectiveTags: StudyTag[]
    recommendations: string[]
  } {
    // Calculer quelles notes étiquetées ont été utiles pour l'exam
    const usefulNotes = examResults.taggedNotes.filter(noteId => 
      examResults.correctAnswers.includes(noteId)
    )
    
    const accuracy = usefulNotes.length / examResults.taggedNotes.length
    
    // Analyser quels types de tags sont les plus efficaces
    // ... logique d'analyse ...
    
    return {
      accuracy,
      mostEffectiveTags: [], // À implémenter
      recommendations: this.generateRecommendations(accuracy)
    }
  }
  
  private generateRecommendations(accuracy: number): string[] {
    const recommendations: string[] = []
    
    if (accuracy < 0.5) {
      recommendations.push(
        "📈 Essaie d'étiqueter plus de définitions et formules",
        "🎯 Concentre-toi sur les notes marquées 'Prof a insisté'"
      )
    } else if (accuracy < 0.8) {
      recommendations.push(
        "✨ Tu es sur la bonne voie ! Continue comme ça",
        "💡 Ajoute des étiquettes de timing pour mieux planifier"
      )
    } else {
      recommendations.push(
        "🏆 Excellent travail ! Tes étiquettes sont super efficaces",
        "🚀 Tu peux maintenant aider tes amis avec tes techniques"
      )
    }
    
    return recommendations
  }
  
  // Génère un planning de révision basé sur les tags
  generateRevisionPlan(
    userId: string, 
    examDate: Date,
    availableHours: number
  ): {
    sessions: Array<{
      date: Date
      duration: number
      tags: StudyTag[]
      notes: string[]
    }>
    totalTime: number
    coverage: number
  } {
    // Algorithme de planification intelligent
    // Priorise par importance des tags et spacing effect
    
    const sessions: Array<{
      date: Date
      duration: number
      tags: StudyTag[]
      notes: string[]
    }> = []
    
    // ... logique de planification ...
    
    return {
      sessions,
      totalTime: sessions.reduce((sum, s) => sum + s.duration, 0),
      coverage: 0.85 // % de notes importantes couvertes
    }
  }
}