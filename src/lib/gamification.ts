// 🎪 GAMIFICATION SYSTEM - App Creator Status

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  criteria: {
    type: 'apps_created' | 'apps_published' | 'users_reached' | 'revenue_generated'
    value: number
  }
  rewards: string[]
  shareTemplates: {
    linkedin?: string
    instagram?: string
    twitter?: string
  }
}

export interface CreatorStatus {
  level: number
  title: string
  badge: string
  perks: string[]
  nextLevel?: {
    title: string
    requirement: string
    progress: number
  }
}

// 🏅 BADGES SOCIAUX VISUELS
export const CREATOR_BADGES: Badge[] = [
  {
    id: 'app_creator',
    name: '🥉 APP CREATOR',
    description: 'Ta première app est en ligne !',
    icon: '🥉',
    color: '#CD7F32',
    criteria: { type: 'apps_created', value: 1 },
    rewards: [
      'Badge LinkedIn spécial',
      'Story Instagram template',
      'Certificat digital à encadrer',
      'Accès communauté débutants'
    ],
    shareTemplates: {
      linkedin: "🎉 Je viens de créer ma première app avec SID HUD ! #AppCreator #NoCode #Innovation",
      instagram: "NEW ACHIEVEMENT UNLOCKED 🥉\n\nApp Creator Status ✅\nMa première app est live ! 🚀\n\n#SIDHUD #AppCreator",
      twitter: "🥉 APP CREATOR unlocked! Ma première app vient d'être publiée avec @SIDHUD 🚀 #NoCode #AppDev"
    }
  },
  {
    id: 'app_entrepreneur',
    name: '🥈 APP ENTREPRENEUR',
    description: '5 apps créées - Tu es un serial creator !',
    icon: '🥈',
    color: '#C0C0C0',
    criteria: { type: 'apps_created', value: 5 },
    rewards: [
      'Accès communauté exclusive',
      'Interviews success stories',
      'Speaking opportunities',
      'Templates premium offerts',
      'Coaching mensuel gratuit'
    ],
    shareTemplates: {
      linkedin: "🥈 APP ENTREPRENEUR certified! 5 apps créées avec SID HUD. Prochaine étape: révolutionner mon industrie ! #Entrepreneur #DigitalTransformation",
      instagram: "LEVEL UP! 🥈\n\nAPP ENTREPRENEUR STATUS\n5 apps live ✅\n\nNext: World domination 🌍\n\n#SIDHUD #Entrepreneur",
      twitter: "🥈 APP ENTREPRENEUR achieved! 5 apps et ce n'est que le début 🚀 Merci @SIDHUD pour cette aventure ! #NoCode #Entrepreneurship"
    }
  },
  {
    id: 'app_innovator',
    name: '🥇 APP INNOVATOR',
    description: '10+ apps - Tu maîtrises l\'art de l\'app creation !',
    icon: '🥇',
    color: '#FFD700',
    criteria: { type: 'apps_created', value: 10 },
    rewards: [
      'Label "Digital Pioneer"',
      'Partenariats SID',
      'Revenus marketplace (30% commission)',
      'Conférences VIP',
      'Mentoring autres créateurs',
      'Early access nouvelles features'
    ],
    shareTemplates: {
      linkedin: "🥇 APP INNOVATOR - 10+ apps créées ! Fier d'être reconnu comme Digital Pioneer par SID HUD. Disponible pour collaborations et speaking. #Innovation #DigitalPioneer",
      instagram: "DIGITAL PIONEER 🥇\n\nAPP INNOVATOR STATUS\n10+ apps créées ✨\n\nOpen for:\n• Collabs\n• Speaking\n• Mentoring\n\n#SIDHUD #DigitalPioneer",
      twitter: "🥇 APP INNOVATOR status unlocked! 10+ apps et maintenant Digital Pioneer certifié 🚀 Let's connect! #Innovation #SIDHUD"
    }
  },
  {
    id: 'app_legend',
    name: '💎 APP LEGEND',
    description: '50+ apps - Tu es une légende vivante !',
    icon: '💎',
    color: '#B9F2FF',
    criteria: { type: 'apps_created', value: 50 },
    rewards: [
      'Hall of Fame SID permanent',
      'Documentaire personnel produit',
      'Legacy status à vie',
      'Actions SID (equity)',
      'Keynote speaker mondial',
      'Livre publié sur ton parcours',
      'Masterclass signature'
    ],
    shareTemplates: {
      linkedin: "💎 APP LEGEND - Un honneur de rejoindre le Hall of Fame SID HUD avec 50+ apps créées. Mon documentaire sort bientôt ! #Legend #DigitalTransformation #Legacy",
      instagram: "LEGENDARY STATUS 💎\n\n50+ APPS CREATED\nHALL OF FAME MEMBER\nDOCUMENTARY COMING\n\nThe journey continues...\n\n#SIDHUD #Legend #Legacy",
      twitter: "💎 APP LEGEND status! 50+ apps, Hall of Fame SID HUD, et mon documentaire en production. What a journey! 🚀 #Legend #Innovation"
    }
  }
]

// 🎯 ACHIEVEMENTS SPÉCIAUX
export const SPECIAL_ACHIEVEMENTS = [
  {
    id: 'speed_creator',
    name: '⚡ SPEED CREATOR',
    description: '3 apps créées en 24h',
    icon: '⚡',
    reward: 'Badge "Lightning Fast" + 1 mois Pro gratuit'
  },
  {
    id: 'viral_app',
    name: '🦠 VIRAL APP',
    description: 'Une app atteint 10K utilisateurs',
    icon: '🦠',
    reward: 'Feature sur la homepage SID + Interview blog'
  },
  {
    id: 'revenue_master',
    name: '💰 REVENUE MASTER',
    description: 'Générer 10K€ avec tes apps',
    icon: '💰',
    reward: 'Commission marketplace réduite à 15%'
  },
  {
    id: 'community_hero',
    name: '🦸 COMMUNITY HERO',
    description: 'Aider 50 créateurs dans la communauté',
    icon: '🦸',
    reward: 'Moderator status + Swag exclusif'
  },
  {
    id: 'template_master',
    name: '🎨 TEMPLATE MASTER',
    description: 'Utiliser tous les templates disponibles',
    icon: '🎨',
    reward: 'Créer ton propre template officiel'
  }
]

// Calculer le statut d'un créateur
export function calculateCreatorStatus(stats: {
  appsCreated: number
  appsPublished: number
  totalUsers: number
  revenue: number
}): CreatorStatus {
  const { appsCreated } = stats
  
  if (appsCreated >= 50) {
    return {
      level: 4,
      title: '💎 APP LEGEND',
      badge: '💎',
      perks: CREATOR_BADGES[3].rewards,
    }
  } else if (appsCreated >= 10) {
    return {
      level: 3,
      title: '🥇 APP INNOVATOR',
      badge: '🥇',
      perks: CREATOR_BADGES[2].rewards,
      nextLevel: {
        title: '💎 APP LEGEND',
        requirement: '50 apps créées',
        progress: (appsCreated / 50) * 100
      }
    }
  } else if (appsCreated >= 5) {
    return {
      level: 2,
      title: '🥈 APP ENTREPRENEUR',
      badge: '🥈',
      perks: CREATOR_BADGES[1].rewards,
      nextLevel: {
        title: '🥇 APP INNOVATOR',
        requirement: '10 apps créées',
        progress: (appsCreated / 10) * 100
      }
    }
  } else if (appsCreated >= 1) {
    return {
      level: 1,
      title: '🥉 APP CREATOR',
      badge: '🥉',
      perks: CREATOR_BADGES[0].rewards,
      nextLevel: {
        title: '🥈 APP ENTREPRENEUR',
        requirement: '5 apps créées',
        progress: (appsCreated / 5) * 100
      }
    }
  } else {
    return {
      level: 0,
      title: '🌱 NEWCOMER',
      badge: '🌱',
      perks: ['Accès aux tutoriels', 'Support prioritaire'],
      nextLevel: {
        title: '🥉 APP CREATOR',
        requirement: 'Créer ta première app',
        progress: 0
      }
    }
  }
}

// Générer un certificat de badge
export function generateCertificate(badge: Badge, userName: string): string {
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return `
    <div style="
      width: 800px;
      height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 60px;
      text-align: center;
      font-family: 'Arial', sans-serif;
      color: white;
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 50px 50px;
        transform: rotate(45deg);
      "></div>
      
      <h1 style="font-size: 48px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
        CERTIFICAT D'EXCELLENCE
      </h1>
      
      <div style="font-size: 120px; margin: 40px 0;">
        ${badge.icon}
      </div>
      
      <h2 style="font-size: 36px; margin-bottom: 20px;">
        ${badge.name}
      </h2>
      
      <p style="font-size: 24px; margin-bottom: 40px;">
        Décerné à
      </p>
      
      <h3 style="font-size: 42px; margin-bottom: 40px; font-weight: bold;">
        ${userName}
      </h3>
      
      <p style="font-size: 20px; margin-bottom: 60px; opacity: 0.9;">
        ${badge.description}
      </p>
      
      <p style="font-size: 18px; opacity: 0.8;">
        Le ${date}
      </p>
      
      <div style="
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 10px;
      ">
        <span style="font-size: 24px;">✨</span>
        <span style="font-size: 20px; font-weight: bold;">SID HUD</span>
        <span style="font-size: 24px;">✨</span>
      </div>
    </div>
  `
}