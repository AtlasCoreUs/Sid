// 🤖 SYSTÈME DE CHAT CONTEXTUEL INTELLIGENT

export interface ChatContext {
  currentStep: string
  userProfile: {
    techLevel: 'beginner' | 'intermediate' | 'expert'
    businessType?: string
    previousQuestions: string[]
  }
  appData?: any
}

export interface FAQResponse {
  question: string
  answer: string
  followUpActions?: Array<{
    label: string
    action: string
  }>
  confidence: number
}

// 💬 BASE DE CONNAISSANCES FAQ
export const FAQ_DATABASE = {
  pricing: {
    "C'est vraiment 299€ pour tout?": {
      answer: "OUI ! 299€ = App complète + Formation équipe + Support VIP + Updates à vie. Pas de frais cachés, JAMAIS. Compare avec une agence web à 10,000€... Tu économises 9,701€ ! 🤯",
      followUp: [
        { label: "Voir le détail de l'offre", action: "show_pricing_details" },
        { label: "Commencer maintenant", action: "start_wizard" }
      ]
    },
    
    "Y a-t-il des frais mensuels?": {
      answer: "ZÉRO frais cachés ! Le hosting est INCLUS la première année (valeur 600€). Après, c'est 19€/mois pour l'hébergement premium. Mais tu peux aussi héberger toi-même si tu veux ! 💪",
      followUp: [
        { label: "En savoir plus sur l'hosting", action: "hosting_info" }
      ]
    },
    
    "Puis-je essayer avant d'acheter?": {
      answer: "MIEUX ! Tu as 60 jours SATISFAIT ou REMBOURSÉ. Si ton CA n'augmente pas de 20%, on te rembourse INTÉGRALEMENT. C'est nous qui prenons le risque, pas toi ! 🛡️",
      followUp: [
        { label: "Créer mon app maintenant", action: "start_wizard" }
      ]
    }
  },
  
  technical: {
    "Je n'y connais rien en tech, c'est grave?": {
      answer: "C'est PARFAIT ! SID est fait pour les NON-TECHNICIENS. Si tu sais envoyer un email, tu sais créer ton app. Notre IA te guide à chaque étape. 95% de nos users n'avaient JAMAIS codé ! 🎉",
      followUp: [
        { label: "Voir une démo", action: "watch_demo" },
        { label: "Commencer avec l'aide de SID", action: "start_with_ai" }
      ]
    },
    
    "Combien de temps pour créer mon app?": {
      answer: "15 MINUTES CHRONO ! ⏱️ 1) Tu choisis ton template (2 min) 2) Tu personnalises (5 min) 3) SID configure tout (8 min) 4) TON APP EST LIVE ! Plus rapide que commander une pizza 🍕",
      followUp: [
        { label: "Essayer maintenant", action: "start_wizard" }
      ]
    },
    
    "Puis-je modifier mon app après?": {
      answer: "ÉVIDEMMENT ! Tu peux TOUT modifier, TOUT le temps. Ajouter des pages, changer les couleurs, nouvelles fonctionnalités... C'est TON app, tu en fais ce que tu veux ! Éditeur visuel super simple inclus 🎨",
      followUp: [
        { label: "Voir l'éditeur en action", action: "editor_demo" }
      ]
    }
  },
  
  features: {
    "Quelles fonctionnalités sont incluses?": {
      answer: "TOUT EST INCLUS ! 📱 App mobile + web, 🤖 IA intégrée, 📊 Analytics, 👥 Gestion équipe, 📅 Réservations, 💳 Paiements, 📧 Notifications, 🔒 Sécurité maximale... La liste est TROP longue ! Regarde ça...",
      followUp: [
        { label: "Voir toutes les features", action: "show_all_features" },
        { label: "Features par métier", action: "features_by_industry" }
      ]
    },
    
    "L'app fonctionne offline?": {
      answer: "OUI ! Mode OFFLINE complet 📴 Tes données sont synchronisées dès que tu retrouves internet. Parfait pour les restos en sous-sol, les salons sans wifi... Tu ne perds JAMAIS une vente ! 💪",
      followUp: [
        { label: "En savoir plus sur le PWA", action: "pwa_info" }
      ]
    },
    
    "Et si j'ai besoin d'une feature spéciale?": {
      answer: "On y a pensé ! 🎯 1) 80% des demandes sont déjà dans l'app 2) Notre marketplace a 500+ extensions 3) API ouverte pour tes développeurs 4) Notre équipe peut coder du sur-mesure. RIEN n'est impossible !",
      followUp: [
        { label: "Explorer le marketplace", action: "marketplace" },
        { label: "Demander une feature", action: "request_feature" }
      ]
    }
  },
  
  support: {
    "Quel support après l'achat?": {
      answer: "SUPPORT VIP À VIE ! 🌟 WhatsApp direct avec l'équipe, réponse en -2h, formation vidéo illimitée, communauté privée de 10,000+ créateurs... On est là jusqu'à ce que tu DOMINES ton marché ! 🚀",
      followUp: [
        { label: "Rejoindre la communauté", action: "join_community" }
      ]
    },
    
    "Et si je me plante?": {
      answer: "IMPOSSIBLE ! 🛡️ 1) SID te guide à chaque étape 2) Templates testés par 10,000+ pros 3) Support WhatsApp 24/7 4) Communauté entraide 5) GARANTIE remboursement 60 jours. Tu ne peux QUE réussir !",
      followUp: [
        { label: "Voir les success stories", action: "success_stories" },
        { label: "Commencer sans risque", action: "start_wizard" }
      ]
    }
  },
  
  business: {
    "Ça marche vraiment pour mon business?": {
      answer: "OUI ! Peu importe ton secteur 🎯 Restaurant? +40% de CA. Salon? -50% no-shows. Clinique? 3x plus de RDV. Gym? +200 membres/mois. On a des SUCCESS STORIES dans TOUS les domaines !",
      followUp: [
        { label: "Voir mon secteur", action: "industry_examples" },
        { label: "Calculer mon ROI", action: "roi_calculator" }
      ]
    },
    
    "Mes concurrents ont déjà un site...": {
      answer: "PARFAIT ! 🔥 Un site en 2024 = une carte de visite en 1990. OBSOLÈTE ! Avec ton app, tu passes de 'comme tout le monde' à 'WOW, c'est quoi ce truc ?!'. First-mover advantage = TU DOMINES ! 👑",
      followUp: [
        { label: "Voir la différence app vs site", action: "app_vs_website" },
        { label: "Devenir le leader maintenant", action: "start_wizard" }
      ]
    }
  }
}

// 🧠 ANALYSEUR DE QUESTIONS INTELLIGENT
export class SmartChatAnalyzer {
  
  // Détecte l'intention de la question
  detectIntent(question: string): string[] {
    const intents = []
    
    // Prix et coûts
    if (/prix|coût|combien|€|euro|cher|gratuit|payer/i.test(question)) {
      intents.push('pricing')
    }
    
    // Technique et difficulté
    if (/difficile|compliqué|tech|coder|programmer|facile/i.test(question)) {
      intents.push('technical')
    }
    
    // Fonctionnalités
    if (/fonction|feature|inclus|peut-on|possible/i.test(question)) {
      intents.push('features')
    }
    
    // Support et aide
    if (/aide|support|accompagn|forma|appren/i.test(question)) {
      intents.push('support')
    }
    
    // Business et ROI
    if (/marche|business|concurrent|client|vente|ca |chiffre/i.test(question)) {
      intents.push('business')
    }
    
    return intents.length > 0 ? intents : ['general']
  }
  
  // Trouve la meilleure réponse
  findBestAnswer(question: string, context: ChatContext): FAQResponse | null {
    const intents = this.detectIntent(question)
    let bestMatch: FAQResponse | null = null
    let highestScore = 0
    
    // Parcourir toutes les catégories pertinentes
    for (const intent of intents) {
      const category = FAQ_DATABASE[intent as keyof typeof FAQ_DATABASE]
      if (!category) continue
      
      for (const [faqQuestion, faqData] of Object.entries(category)) {
        const score = this.calculateSimilarity(question, faqQuestion)
        
        if (score > highestScore) {
          highestScore = score
          bestMatch = {
            question: faqQuestion,
            answer: faqData.answer,
            followUpActions: faqData.followUp,
            confidence: score
          }
        }
      }
    }
    
    // Si la confiance est trop faible, proposer une réponse générique
    if (!bestMatch || highestScore < 0.3) {
      return this.getGenericResponse(question, context)
    }
    
    return bestMatch
  }
  
  // Calcule la similarité entre deux questions
  calculateSimilarity(q1: string, q2: string): number {
    const normalize = (str: string) => str.toLowerCase()
      .replace(/[?!.,]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
    
    const words1 = normalize(q1)
    const words2 = normalize(q2)
    
    // Mots en commun
    const common = words1.filter(word => words2.includes(word))
    
    // Score de Jaccard
    const union = new Set([...words1, ...words2])
    const score = common.length / union.size
    
    // Bonus si mots clés importants
    const keywords = ['prix', 'combien', 'temps', 'difficile', 'marche', 'support']
    const keywordBonus = keywords.filter(kw => 
      q1.toLowerCase().includes(kw) && q2.toLowerCase().includes(kw)
    ).length * 0.2
    
    return Math.min(score + keywordBonus, 1)
  }
  
  // Réponse générique intelligente
  getGenericResponse(question: string, context: ChatContext): FAQResponse {
    const responses = {
      beginner: "Super question ! 🤔 Je ne suis pas sûr d'avoir la réponse exacte, mais ce que je peux te dire c'est que SID est conçu pour être ULTRA simple. Veux-tu que je te montre une démo ou préfères-tu parler à un humain ?",
      intermediate: "Excellente question ! Pour être sûr de te donner la meilleure réponse, peux-tu me préciser un peu plus ? En attendant, sache que 95% des features demandées sont déjà incluses !",
      expert: "Question technique intéressante ! Notre API est documentée sur docs.sid-hud.com. Pour une réponse précise, notre équipe tech est dispo sur le Slack dédié. Veux-tu que je te connecte ?"
    }
    
    return {
      question: question,
      answer: responses[context.userProfile.techLevel],
      followUpActions: [
        { label: "Voir une démo", action: "watch_demo" },
        { label: "Parler à un humain", action: "human_support" },
        { label: "Explorer les docs", action: "documentation" }
      ],
      confidence: 0.5
    }
  }
}

// 🎯 RÉPONSES CONTEXTUELLES PAR ÉTAPE
export const STEP_SPECIFIC_RESPONSES = {
  businessInfo: {
    greeting: "Salut ! Je suis SID 🤖 Raconte-moi ton business, je vais t'aider à créer une app qui CARTONNE ! C'est quoi ton projet ?",
    
    tips: [
      "💡 Astuce: Plus tu me donnes de détails, plus ton app sera personnalisée !",
      "🎯 Pense à tes clients: qu'est-ce qui les frustre aujourd'hui ?",
      "🚀 Imagine ton business dans 1 an avec ton app... Excitant non ?"
    ],
    
    encouragements: [
      "Génial ! Continue comme ça ! 🔥",
      "J'adore ton projet ! Ça va être ÉNORME ! 💪",
      "Tu vas révolutionner ton secteur ! 🚀"
    ]
  },
  
  template: {
    greeting: "OK, maintenant le fun ! 🎨 Quel style d'app tu veux ? J'ai des templates DE MALADE qui ont fait leurs preuves !",
    
    recommendations: {
      restaurant: "Le template RESTAURANT a généré +40% de CA en moyenne ! Avec gestion stocks, allergènes, équipe... C'est une MACHINE DE GUERRE ! 🍽️",
      salon: "SALON BEAUTÉ = -50% no-shows GARANTI ! Booking intelligent, rappels auto, galerie avant/après... Tes clientes vont ADORER ! 💅",
      clinic: "CLINIQUE MÉDICALE: Conformité totale, prise RDV intelligente, dossiers sécurisés... Les patients disent que c'est MIEUX qu'un hôpital ! ⚕️",
      gym: "GYM POWER: +200 membres en 3 mois en moyenne ! Challenges, leaderboards, réservations... Les membres deviennent ADDICTS ! 💪"
    }
  },
  
  customization: {
    greeting: "Time to shine ! ✨ On va faire de ton app un BIJOU visuel. Tes couleurs préférées ?",
    
    colorPsychology: {
      purple: "Violet = Luxe et créativité. PARFAIT pour se démarquer ! 💜",
      blue: "Bleu = Confiance et professionnalisme. Les clients ADORENT ! 💙",
      green: "Vert = Croissance et santé. Idéal pour le bien-être ! 💚",
      orange: "Orange = Énergie et enthousiasme. Ça va PÉTER ! 🧡"
    }
  },
  
  features: {
    greeting: "Dernière étape ! 🎯 Quelles super-powers tu veux dans ton app ? (Spoiler: tu peux TOUT avoir !)",
    
    musthaves: {
      all: [
        "📱 Notifications push = +40% engagement GARANTI",
        "📊 Analytics temps réel = Tu vois TOUT ce qui se passe",
        "🔒 Sécurité maximale = Tes données sont INTOUCHABLES",
        "🌐 Multi-langues = Conquiers le MONDE entier"
      ]
    }
  },
  
  review: {
    greeting: "BRAVO ! 🎉 Ton app est PRÊTE ! Regarde-moi ce bijou... Tu vas DOMINER ton marché !",
    
    finalPush: [
      "⚡ Dans 30 secondes, ton app sera LIVE",
      "🚀 Tes concurrents vont HALLUCINER",
      "💎 Tu rejoins l'élite des APP CREATORS",
      "🏆 Prépare-toi au SUCCESS !"
    ]
  }
}

// 🔥 GÉNÉRATEUR DE RÉPONSES DYNAMIQUES
export class DynamicResponseGenerator {
  
  generateResponse(context: ChatContext, userMessage: string): string {
    const analyzer = new SmartChatAnalyzer()
    const faqResponse = analyzer.findBestAnswer(userMessage, context)
    
    // Si on a une FAQ qui match bien
    if (faqResponse && faqResponse.confidence > 0.7) {
      return this.formatFAQResponse(faqResponse, context)
    }
    
    // Sinon, réponse contextuelle selon l'étape
    return this.getStepSpecificResponse(context, userMessage)
  }
  
  formatFAQResponse(faq: FAQResponse, context: ChatContext): string {
    let response = faq.answer
    
    // Personnaliser selon le profil
    if (context.userProfile.businessType) {
      response = response.replace(/ton business/gi, `ton ${context.userProfile.businessType}`)
    }
    
    // Ajouter les actions suggérées
    if (faq.followUpActions && faq.followUpActions.length > 0) {
      response += "\n\n💡 Je peux aussi:"
      faq.followUpActions.forEach(action => {
        response += `\n• ${action.label}`
      })
    }
    
    return response
  }
  
  getStepSpecificResponse(context: ChatContext, message: string): string {
    const stepResponses = STEP_SPECIFIC_RESPONSES[context.currentStep as keyof typeof STEP_SPECIFIC_RESPONSES]
    
    if (!stepResponses) {
      return "Je suis là pour t'aider ! Dis-moi ce que tu veux savoir 🤖"
    }
    
    // Détecter le type de message
    if (message.length < 10) {
      // Message court = encouragement
      const encouragements = (stepResponses as any).encouragements || ["Super ! 👍"]
      return encouragements[Math.floor(Math.random() * encouragements.length)]
    }
    
    // Message avec question
    if (message.includes('?')) {
      return this.handleStepQuestion(context, message)
    }
    
    // Sinon, conseil contextuel
    const tips = (stepResponses as any).tips || ["Continue, tu es sur la bonne voie ! 🚀"]
    return tips[Math.floor(Math.random() * tips.length)]
  }
  
  handleStepQuestion(context: ChatContext, question: string): string {
    // Questions spécifiques par étape
    const stepQuestions: Record<string, Record<string, string>> = {
      businessInfo: {
        "clients": "Excellente question ! Pense à tes meilleurs clients actuels. Qu'est-ce qui les ferait dire 'WOW' ? Une app qui leur fait gagner du temps ? Qui les fidélise ? Dis-moi tout ! 🎯",
        "concurrent": "Les concurrents ? PARFAIT ! Tu vas les DÉPASSER ! Avec ton app, tu passes de 'comme eux' à 'UNIQUE'. C'est quoi leur plus gros point faible ? 😈"
      },
      template: {
        "différence": "Excellente question ! Chaque template est OPTIMISÉ pour son secteur. Restaurant = gestion équipe. Salon = anti no-show. Clinique = conformité médicale. Lequel te fait vibrer ? 🚀",
        "personnalis": "TOUT est personnalisable ! Le template c'est juste la base PARFAITE. Après, on adapte 100% à TON business. C'est ça la magie ! ✨"
      }
    }
    
    // Chercher des mots clés dans la question
    const currentStepQuestions = stepQuestions[context.currentStep] || {}
    
    for (const [keyword, response] of Object.entries(currentStepQuestions)) {
      if (question.toLowerCase().includes(keyword)) {
        return response
      }
    }
    
    // Réponse par défaut encourageante
    return "Super question ! 🤔 Ça montre que tu réfléchis bien à ton projet. Continue à me donner des détails, plus j'en sais, plus ton app sera PARFAITE ! 💪"
  }
}