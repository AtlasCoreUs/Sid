// 🍽️ WORKFLOW CRÉATION APP RESTAURANT - STORYTELLING MARKETING

export interface RestaurantWorkflow {
  trigger: {
    moment: string
    pain: string[]
    emotion: string
    searchPath: string[]
  }
  process: {
    duration: string
    steps: WorkflowStep[]
  }
  result: {
    immediate: string[]
    week1: string[]
    month1: string[]
  }
}

export interface WorkflowStep {
  name: string
  duration: string
  actions: string[]
  aiAssistance: string[]
  visuals: string[]
}

// 🌅 STORYTELLING : "LUNDI MATIN CHEZ MARC"
export const RESTAURANT_CRISIS_STORY = {
  title: "L'histoire de Marc et son restaurant qui frôle la catastrophe",
  
  act1_crisis: {
    time: "Lundi 8h30",
    scene: "Restaurant 'Chez Marc' - 15 employés",
    events: [
      "😱 Le nouveau cuisinier brûle 3 plats → 150€ de pertes",
      "🚨 Client allergique aux noix → panique en cuisine",
      "📱 Marc malade, absent 2 jours → chaos total",
      "💭 'Il faut que ça CHANGE !'"
    ],
    emotions: ["frustration", "urgence", "détermination"]
  },

  act2_discovery: {
    time: "Lundi 14h",
    actions: [
      "🔍 Google: 'app gestion restaurant'",
      "📱 Trouve pub Facebook SID HUD",
      "👀 'App restaurant en 15 min?'",
      "🤔 'Ça peut pas être si simple...'"
    ],
    hook: "Vidéo témoignage d'un restaurateur : '+40% efficacité en 1 mois'"
  },

  act3_transformation: {
    time: "Lundi 14h15 - 14h30",
    process: "Création app en direct",
    result: "App 'Chez Marc Team' opérationnelle"
  },

  act4_success: {
    week1: [
      "✅ Plus AUCUNE erreur allergène",
      "📈 Temps service -25%",
      "😊 Équipe autonome même sans Marc",
      "💰 +2000€ économisés"
    ],
    month1: [
      "⭐ Note Google passe de 4.2 à 4.8",
      "🎯 30% commandes en plus",
      "👨‍🍳 Turnover staff divisé par 3",
      "🏆 Meilleur mois depuis 3 ans"
    ]
  }
}

// 📱 TEMPLATE RESTAURANT COMPLET
export const RESTAURANT_APP_TEMPLATE = {
  metadata: {
    name: "Restaurant Pro Team",
    price: 299,
    setupTime: "15 minutes",
    roi: "Retour sur investissement en 2 semaines",
    targetAudience: "Restaurants 5-50 employés"
  },

  modules: {
    // 🏠 ÉCRAN D'ACCUEIL PERSONNALISÉ
    homeScreen: {
      layout: `
┌─ {Restaurant Name} - Team App ─────────┐
│ 🍽️ [Logo Restaurant]                  │
│ Bonjour {Employee Name} ! ({Role})    │
├────────────────────────────────────────┤
│                                        │
│ 🔥 AUJOURD'HUI ({Date})               │
│ ┌──────────────────────────────────┐  │
│ │ ⚠️ ALLERGIES À SURVEILLER:       │  │
│ │ • Table 7: Gluten                │  │
│ │ • Table 12: Lactose              │  │
│ └──────────────────────────────────┘  │
│                                        │
│ 📋 TON PLANNING:                       │
│ • Service: {Shift Times}               │
│ • Poste: {Station}                     │
│ • Break: {Break Time}                  │
│                                        │
│ 🎯 ACTIONS RAPIDES:                    │
│ [📖 Recettes] [📦 Stocks] [👥 Team]   │
│                                        │
│ 📊 LIVE STATS:                         │
│ • Plats servis: {Count}/{Target}       │
│ • Temps moyen: {AvgTime} min          │
│ • Satisfaction: ⭐⭐⭐⭐⭐ {Rating}    │
└────────────────────────────────────────┘
      `,
      features: [
        "Dashboard personnalisé par rôle",
        "Alertes allergènes en temps réel",
        "Stats de performance live",
        "Planning intégré"
      ]
    },

    // 📖 MODULE RECETTES INTELLIGENTES
    recipes: {
      categories: ["Entrées", "Plats", "Desserts", "Boissons", "Sauces"],
      features: [
        "🎥 Vidéos étape par étape",
        "⏱️ Timers intégrés",
        "🔄 Conversion portions automatique",
        "🌡️ Températures de cuisson",
        "💡 Tips du chef",
        "⚠️ Alertes allergènes"
      ],
      
      exampleRecipe: {
        name: "Bœuf Bourguignon du Chef",
        difficulty: "Expert",
        time: "3h30",
        portions: 6,
        cost: "8.50€/portion",
        
        ingredients: [
          { item: "Bœuf", qty: "1.5kg", allergens: [] },
          { item: "Vin rouge", qty: "75cl", allergens: ["sulfites"] },
          { item: "Lardons", qty: "200g", allergens: [] }
        ],
        
        steps: [
          {
            num: 1,
            action: "Découper le bœuf en cubes de 4cm",
            time: "10 min",
            video: "decoupe-boeuf.mp4",
            tips: "Garder les morceaux uniformes pour cuisson égale"
          }
        ],
        
        plating: {
          photo: "bourguignon-final.jpg",
          description: "Servir dans assiette creuse chaude",
          garnish: ["Persil frais", "Croûtons ail"]
        }
      }
    },

    // 📦 GESTION STOCKS INTELLIGENTE
    inventory: {
      features: [
        "Scanner code-barres",
        "Alertes stock bas",
        "Commandes fournisseurs intégrées",
        "Calcul food cost automatique",
        "Prévisions basées sur historique"
      ],
      
      alerts: {
        low: "Stock < 20%",
        expiry: "Produits expirent dans 48h",
        abnormal: "Consommation anormale détectée"
      }
    },

    // 👥 COMMUNICATION ÉQUIPE
    team: {
      features: [
        "Chat par service/poste",
        "Annonces importantes",
        "Changements planning",
        "Demandes congés",
        "Formation vidéos"
      ],
      
      channels: [
        "#cuisine",
        "#salle", 
        "#management",
        "#urgences"
      ]
    },

    // 📊 TABLEAU DE BORD MANAGER
    analytics: {
      realtime: [
        "Tables occupées",
        "Temps d'attente moyen",
        "Plats en cours",
        "Revenue du jour"
      ],
      
      reports: [
        "Performance par employé",
        "Plats les plus vendus",
        "Gaspillage alimentaire",
        "Satisfaction clients",
        "Comparaison vs objectifs"
      ]
    },

    // 🎓 FORMATION CONTINUE
    training: {
      modules: [
        "Onboarding nouveaux employés",
        "Techniques de service",
        "Hygiène HACCP",
        "Gestion des conflits",
        "Upselling efficace"
      ],
      
      gamification: [
        "Badges de compétences",
        "Leaderboard mensuel",
        "Récompenses performance"
      ]
    }
  },

  // 🚀 FONCTIONNALITÉS UNIQUES
  killerFeatures: {
    voiceCommands: {
      description: "Commandes vocales en cuisine",
      examples: [
        "Ok SID, temps de cuisson saumon",
        "Ok SID, allergènes table 12",
        "Ok SID, commencer timer 15 minutes"
      ]
    },
    
    aiOptimization: {
      description: "IA optimise les opérations",
      features: [
        "Prédiction affluence",
        "Suggestions menu du jour",
        "Optimisation planning staff",
        "Détection gaspillage"
      ]
    },
    
    clientFacing: {
      description: "App client connectée",
      features: [
        "Menu digital avec photos",
        "Commande depuis table",
        "Paiement sans contact",
        "Programme fidélité"
      ]
    }
  },

  // 💰 BUSINESS MODEL & ROI
  businessCase: {
    investment: 299,
    savings: {
      monthly: {
        "Réduction gaspillage": 500,
        "Efficacité service": 800,
        "Moins d'erreurs": 300,
        "Fidélisation clients": 700
      },
      total: 2300
    },
    
    roi: {
      breakeven: "5 jours",
      profit1stMonth: 2001,
      profit1stYear: 27612
    },
    
    testimonials: [
      {
        name: "Sophie L.",
        restaurant: "Le Petit Bistrot",
        quote: "En 1 mois, -30% de gaspillage et +25% de CA. Magique !",
        rating: 5
      },
      {
        name: "Ahmed K.",
        restaurant: "Délices d'Orient",
        quote: "Mes serveurs adorent. Plus d'erreurs sur les commandes !",
        rating: 5
      }
    ]
  },

  // 🎯 CALL TO ACTION
  cta: {
    urgency: "🔥 Offre limitée : -30% ce mois",
    guarantee: "✅ Satisfait ou remboursé 30 jours",
    bonus: "🎁 Formation équipe offerte (valeur 500€)",
    
    buttons: [
      {
        text: "Créer Mon App Restaurant",
        style: "neon-pulse",
        action: "start_wizard"
      },
      {
        text: "Voir Démo Live",
        style: "glass",
        action: "view_demo"
      }
    ]
  }
}