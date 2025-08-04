// 📱 STRATÉGIE RÉSEAUX SOCIAUX & BUSINESS PLAN INTÉGRÉ

export interface ContentPlan {
  date: string
  platform: string
  content: string
  type: string
}

export interface Automation {
  name: string
  trigger: string
  action: string
}

export interface AnalyticsTracking {
  metric: string
  target: number
  platform: string
}

export interface Schedule {
  frequency: string
  times: string[]
  days: string[]
}

export interface ContentTemplate {
  name: string
  template: string
  variables: string[]
}

export interface SocialMediaStrategy {
  platforms: Platform[]
  contentCalendar: ContentPlan[]
  automations: Automation[]
  analytics: AnalyticsTracking[]
}

export interface Platform {
  name: string
  objectives: string[]
  contentTypes: string[]
  postingSchedule: Schedule
  templates: ContentTemplate[]
}

// 🎯 STRATÉGIE SOCIAL MEDIA POUR CHAQUE TYPE D'APP
export const SOCIAL_STRATEGIES = {
  restaurant: {
    goals: [
      "Attirer nouveaux clients locaux",
      "Fidéliser clientèle existante",
      "Gérer réputation en ligne",
      "Promouvoir offres spéciales"
    ],
    
    platforms: {
      instagram: {
        frequency: "2 posts/jour",
        bestTimes: ["12h-13h", "19h-21h"],
        content: [
          {
            type: "Plat du jour",
            template: `
📸 [Photo plat en gros plan]

🍽️ PLAT DU JOUR
{Nom du plat}

✨ {Description courte et appétissante}

💰 Prix: {Prix}€
⏰ Disponible jusqu'à {Heure}

📍 Réservez: {Lien/Téléphone}

#RestaurantMarc #PlatDuJour #FoodLover #[Ville]
            `,
            tips: [
              "Photo en lumière naturelle",
              "Angle 45° pour volume",
              "Assiette propre",
              "Décoration simple"
            ]
          },
          {
            type: "Behind the scenes",
            template: `
👨‍🍳 EN CUISINE AVEC NOTRE CHEF

{Action en cours}

💬 "{Citation du chef}"

Suivez-nous pour plus de secrets ! 

#ChefLife #BehindTheScenes #RestaurantMarc
            `
          },
          {
            type: "Client satisfait",
            template: `
⭐⭐⭐⭐⭐ MERCI !

"{Avis client}"
- {Prénom}

Votre satisfaction est notre priorité 🙏

#ClientHeureux #Avis5Etoiles #RestaurantMarc
            `
          }
        ],
        
        stories: [
          {
            type: "Préparation en direct",
            elements: ["Vidéo courte", "Musique tendance", "Sticker sondage"]
          },
          {
            type: "Question du jour",
            elements: ["Fond coloré", "Question interactive", "Réponses en story"]
          }
        ],
        
        reels: [
          {
            type: "Recette rapide",
            script: "Montrer 3 étapes clés en 15 secondes",
            music: "Son tendance du moment"
          }
        ]
      },
      
      facebook: {
        frequency: "1 post/jour",
        bestTimes: ["12h", "19h"],
        content: [
          {
            type: "Menu de la semaine",
            template: `
🗓️ MENU DE LA SEMAINE - {Dates}

LUNDI
🥗 Entrée: {Entrée}
🍖 Plat: {Plat}
🍰 Dessert: {Dessert}

[Continuer pour chaque jour...]

📞 Réservations: {Téléphone}
🌐 Menu complet: {Site web}

À bientôt chez {Nom Restaurant} !
            `
          },
          {
            type: "Événement spécial",
            template: `
🎉 ÉVÉNEMENT SPÉCIAL

{Titre événement}
📅 Date: {Date}
⏰ Heure: {Heure}

{Description détaillée}

✨ Au programme:
• {Point 1}
• {Point 2}
• {Point 3}

Places limitées !
Réservez au {Téléphone}

#Evenement #RestaurantMarc #[Ville]
            `
          }
        ],
        
        ads: [
          {
            objective: "Trafic local",
            audience: "25-65 ans, rayon 10km",
            budget: "5€/jour",
            creative: "Carousel plats signatures"
          }
        ]
      },
      
      google_my_business: {
        frequency: "3 posts/semaine",
        content: [
          {
            type: "Mise à jour horaires",
            importance: "CRITIQUE"
          },
          {
            type: "Photos nouvelles",
            frequency: "Hebdomadaire"
          },
          {
            type: "Réponse aux avis",
            sla: "Sous 24h"
          }
        ]
      },
      
      tiktok: {
        frequency: "3-5/semaine",
        content: [
          {
            type: "Défi cuisine",
            format: "Vidéo 15-30s",
            hashtags: ["#FoodChallenge", "#RestaurantLife", "#ChefTok"]
          },
          {
            type: "Transformation plat",
            format: "Before/After rapide",
            music: "Son viral du moment"
          }
        ]
      }
    },
    
    // 📅 CALENDRIER ÉDITORIAL AUTOMATISÉ
    contentCalendar: {
      monday: [
        { time: "11h30", type: "story", content: "Préparation du jour" },
        { time: "12h00", type: "post", content: "Plat du jour" },
        { time: "19h00", type: "story", content: "Service du soir" }
      ],
      tuesday: [
        { time: "10h00", type: "post", content: "Recette de la semaine" },
        { time: "18h00", type: "reel", content: "Behind the scenes" }
      ],
      wednesday: [
        { time: "12h00", type: "post", content: "Menu midi spécial" },
        { time: "20h00", type: "story", content: "Question interactive" }
      ],
      thursday: [
        { time: "11h00", type: "post", content: "Throwback jeudi" },
        { time: "19h00", type: "live", content: "Chef en direct" }
      ],
      friday: [
        { time: "12h00", type: "post", content: "Menu weekend" },
        { time: "17h00", type: "story", content: "Préparatifs weekend" }
      ],
      saturday: [
        { time: "10h00", type: "post", content: "Brunch special" },
        { time: "19h00", type: "story", content: "Ambiance samedi soir" }
      ],
      sunday: [
        { time: "11h00", type: "post", content: "Sunday roast" },
        { time: "15h00", type: "story", content: "Dessert du dimanche" }
      ]
    },
    
    // 🤖 AUTOMATIONS MARKETING
    automations: [
      {
        trigger: "Nouveau follower Instagram",
        action: "DM automatique de bienvenue + code promo 10%"
      },
      {
        trigger: "Mention dans story",
        action: "Repost + remerciement"
      },
      {
        trigger: "Avis Google 5 étoiles",
        action: "Réponse personnalisée + invitation VIP"
      },
      {
        trigger: "Anniversaire client (CRM)",
        action: "Email + post story anniversaire"
      },
      {
        trigger: "Météo pluvieuse",
        action: "Post 'comfort food' + livraison gratuite"
      }
    ],
    
    // 📊 KPIs À TRACKER
    analytics: {
      daily: [
        "Nombre de vues stories",
        "Engagement rate posts",
        "Mentions et tags",
        "Messages reçus"
      ],
      weekly: [
        "Croissance followers",
        "Reach total",
        "Clics vers site/réservation",
        "Conversions (réservations)"
      ],
      monthly: [
        "ROI publicités",
        "Sentiment analysis",
        "Top performing content",
        "Competitor analysis"
      ]
    },
    
    // 💰 BUDGET MARKETING RECOMMANDÉ
    budget: {
      tools: {
        "Canva Pro": 12,
        "Later/Buffer": 15,
        "Facebook Ads": 150,
        "Google Ads": 200,
        "Influenceurs locaux": 100
      },
      totalMonthly: 477,
      expectedROI: "3-5x en 3 mois"
    },
    
    // 🎯 GROWTH HACKS SPÉCIFIQUES
    growthHacks: [
      {
        name: "Concours Instagram mensuel",
        mechanics: "Tag 3 amis + follow = 1 repas gratuit tirage au sort",
        expectedResult: "+500 followers/mois"
      },
      {
        name: "Partenariat food bloggers",
        mechanics: "Inviter 1 blogger/semaine pour review",
        expectedResult: "Reach x10 audience"
      },
      {
        name: "User Generated Content",
        mechanics: "Repost photos clients avec #ChezMarc",
        expectedResult: "50% réduction coût contenu"
      },
      {
        name: "Happy Hour Instagram",
        mechanics: "-20% si story postée entre 17h-19h",
        expectedResult: "+30% trafic happy hour"
      }
    ]
  },
  
  // Ajouter strategies pour gym, salon, clinic, hotel, agency...
}

// 📈 BUSINESS PLAN TEMPLATE INTÉGRÉ
export const BUSINESS_PLAN_GENERATOR = {
  sections: {
    executive_summary: {
      template: `
# EXECUTIVE SUMMARY - {Business Name}

## Vision
{Vision Statement}

## Mission
{Mission Statement}

## Objectifs 12 mois
1. {Objectif 1}
2. {Objectif 2}
3. {Objectif 3}

## Besoins Financiers
• Investissement initial: {Amount}€
• ROI attendu: {ROI}% en {Timeline}
      `
    },
    
    market_analysis: {
      template: `
# ANALYSE DE MARCHÉ

## Taille du marché
• Marché total (TAM): {TAM}€
• Marché adressable (SAM): {SAM}€
• Marché capturable (SOM): {SOM}€

## Tendances clés
1. {Trend 1}
2. {Trend 2}
3. {Trend 3}

## Analyse concurrentielle
| Concurrent | Forces | Faiblesses | Part de marché |
|------------|---------|------------|----------------|
| {Comp 1}   | ...     | ...        | {%}           |
      `
    },
    
    marketing_strategy: {
      template: `
# STRATÉGIE MARKETING

## Positionnement
{Positioning Statement}

## Personas Cibles
### Persona 1: {Name}
• Âge: {Age}
• Revenus: {Income}
• Besoins: {Needs}
• Canaux: {Channels}

## Mix Marketing (4P)
### Produit
{Product Strategy}

### Prix
{Pricing Strategy}

### Place
{Distribution Strategy}

### Promotion
{Promotion Strategy}

## Canaux d'acquisition
1. {Channel 1}: {Budget}€/mois → {Expected CAC}€
2. {Channel 2}: {Budget}€/mois → {Expected CAC}€
      `
    },
    
    financial_projections: {
      template: `
# PROJECTIONS FINANCIÈRES

## Revenus prévisionnels
| Mois | Nouveaux clients | Revenu récurrent | Total |
|------|------------------|------------------|--------|
| M1   | {X}             | {Y}€            | {Z}€  |

## Structure de coûts
• Coûts fixes: {Fixed}€/mois
• Coûts variables: {Variable}% du CA
• Marge brute: {Margin}%

## Seuil de rentabilité
{Breakeven} clients ou {Revenue}€ de CA mensuel
Attendu en mois {Month}

## Scénarios
### Pessimiste (-30%)
{Pessimistic Projection}

### Réaliste
{Realistic Projection}

### Optimiste (+50%)
{Optimistic Projection}
      `
    },
    
    action_plan: {
      template: `
# PLAN D'ACTION 90 JOURS

## Jours 1-30: Foundation
□ {Action 1}
□ {Action 2}
□ {Action 3}

## Jours 31-60: Growth
□ {Action 4}
□ {Action 5}
□ {Action 6}

## Jours 61-90: Scale
□ {Action 7}
□ {Action 8}
□ {Action 9}

## KPIs à suivre
• {KPI 1}: Objectif {Target}
• {KPI 2}: Objectif {Target}
• {KPI 3}: Objectif {Target}
      `
    }
  },
  
  // 🚀 QUICK START PACKAGES
  quickStartPackages: {
    restaurant: {
      investment: 2000,
      timeline: "3 mois",
      actions: [
        "Setup complet réseaux sociaux",
        "Shooting photo professionnel",
        "Campagne lancement 30 jours",
        "Formation équipe social media",
        "Système avis clients automatisé"
      ],
      expectedResults: {
        month1: "+20% visibilité locale",
        month2: "+15% nouveaux clients",
        month3: "+25% CA moyen"
      }
    }
  }
}