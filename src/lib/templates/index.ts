export interface TemplateSection {
  id: string
  type: 'hero' | 'services' | 'about' | 'gallery' | 'contact' | 'testimonials' | 'pricing' | 'team' | 'features' | 'cta' | 'faq' | 'portfolio'
  title?: string
  content?: any
  style?: any
}

export interface Template {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  sections: TemplateSection[]
  defaultColors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
}

export const templates: Template[] = [
  {
    id: 'restaurant',
    name: 'Restaurant Gastronomique',
    category: 'Restaurant',
    description: 'Template élégant pour restaurants avec menu, réservation et galerie',
    features: ['menu', 'reservation', 'gallery', 'reviews'],
    sections: [
      {
        id: 'hero',
        type: 'hero',
        content: {
          title: 'Bienvenue chez {businessName}',
          subtitle: 'Une expérience culinaire unique',
          image: '/templates/restaurant/hero.jpg',
          cta: [
            { text: 'Réserver une table', action: 'reservation' },
            { text: 'Voir le menu', action: 'menu' }
          ]
        }
      },
      {
        id: 'about',
        type: 'about',
        title: 'Notre Histoire',
        content: {
          text: 'Découvrez notre passion pour la gastronomie...',
          images: ['/templates/restaurant/about1.jpg', '/templates/restaurant/about2.jpg']
        }
      },
      {
        id: 'menu',
        type: 'services',
        title: 'Notre Menu',
        content: {
          categories: ['Entrées', 'Plats', 'Desserts', 'Vins'],
          style: 'elegant-cards'
        }
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Galerie Photos',
        content: {
          layout: 'masonry',
          showCaptions: true
        }
      },
      {
        id: 'testimonials',
        type: 'testimonials',
        title: 'Avis Clients',
        content: {
          style: 'carousel',
          showRating: true
        }
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Contact & Réservation',
        content: {
          showMap: true,
          showHours: true,
          showReservationForm: true
        }
      }
    ],
    defaultColors: {
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#FFD700'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato'
    }
  },
  {
    id: 'clinic',
    name: 'Clinique Médicale',
    category: 'Santé',
    description: 'Template professionnel pour cliniques et cabinets médicaux',
    features: ['appointment', 'services', 'team', 'contact'],
    sections: [
      {
        id: 'hero',
        type: 'hero',
        content: {
          title: '{businessName}',
          subtitle: 'Votre santé, notre priorité',
          image: '/templates/clinic/hero.jpg',
          cta: [
            { text: 'Prendre RDV', action: 'appointment' },
            { text: 'Urgences', action: 'emergency' }
          ]
        }
      },
      {
        id: 'services',
        type: 'services',
        title: 'Nos Services',
        content: {
          layout: 'grid-icons',
          items: [
            { icon: 'heart', title: 'Cardiologie', description: 'Soins cardiaques experts' },
            { icon: 'brain', title: 'Neurologie', description: 'Traitement des troubles neurologiques' },
            { icon: 'bone', title: 'Orthopédie', description: 'Soins des os et articulations' }
          ]
        }
      },
      {
        id: 'team',
        type: 'team',
        title: 'Notre Équipe Médicale',
        content: {
          layout: 'cards',
          showSpecialty: true,
          showQualifications: true
        }
      },
      {
        id: 'about',
        type: 'about',
        title: 'À Propos',
        content: {
          mission: 'Fournir des soins de santé exceptionnels',
          values: ['Excellence', 'Compassion', 'Innovation']
        }
      },
      {
        id: 'faq',
        type: 'faq',
        title: 'Questions Fréquentes',
        content: {
          categories: ['Rendez-vous', 'Assurance', 'Soins']
        }
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Contact',
        content: {
          showEmergencyNumber: true,
          showHours: true,
          showInsurance: true
        }
      }
    ],
    defaultColors: {
      primary: '#0066CC',
      secondary: '#00A3E0',
      accent: '#4CAF50'
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans'
    }
  },
  {
    id: 'salon',
    name: 'Salon de Beauté',
    category: 'Beauté',
    description: 'Template moderne pour salons de coiffure et instituts de beauté',
    features: ['booking', 'services', 'gallery', 'products'],
    sections: [
      {
        id: 'hero',
        type: 'hero',
        content: {
          title: '{businessName}',
          subtitle: 'Révélez votre beauté naturelle',
          image: '/templates/salon/hero.jpg',
          cta: [
            { text: 'Réserver', action: 'booking' },
            { text: 'Nos Services', action: 'services' }
          ]
        }
      },
      {
        id: 'services',
        type: 'services',
        title: 'Nos Prestations',
        content: {
          categories: ['Coiffure', 'Esthétique', 'Manucure', 'Maquillage'],
          showPrices: true,
          showDuration: true
        }
      },
      {
        id: 'team',
        type: 'team',
        title: 'Nos Experts',
        content: {
          showSpecialties: true,
          showInstagram: true
        }
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Nos Réalisations',
        content: {
          categories: ['Coiffure', 'Maquillage', 'Ongles'],
          layout: 'instagram-style'
        }
      },
      {
        id: 'pricing',
        type: 'pricing',
        title: 'Nos Tarifs',
        content: {
          showPackages: true,
          showPromotions: true
        }
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Nous Trouver',
        content: {
          showBookingCalendar: true,
          showSocialMedia: true
        }
      }
    ],
    defaultColors: {
      primary: '#E91E63',
      secondary: '#FF6B6B',
      accent: '#FFD93D'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Nunito'
    }
  },
  {
    id: 'gym',
    name: 'Salle de Sport',
    category: 'Sport',
    description: 'Template dynamique pour salles de sport et centres de fitness',
    features: ['membership', 'classes', 'trainers', 'schedule'],
    sections: [
      {
        id: 'hero',
        type: 'hero',
        content: {
          title: 'Transformez votre corps',
          subtitle: 'Rejoignez {businessName}',
          video: '/templates/gym/hero-video.mp4',
          cta: [
            { text: 'Essai Gratuit', action: 'trial' },
            { text: 'Nos Abonnements', action: 'membership' }
          ]
        }
      },
      {
        id: 'features',
        type: 'features',
        title: 'Pourquoi Nous Choisir',
        content: {
          items: [
            { icon: 'equipment', title: 'Équipement Premium' },
            { icon: 'trainer', title: 'Coachs Certifiés' },
            { icon: 'classes', title: 'Cours Collectifs' },
            { icon: '24h', title: 'Ouvert 24/7' }
          ]
        }
      },
      {
        id: 'classes',
        type: 'services',
        title: 'Nos Cours',
        content: {
          schedule: true,
          categories: ['Yoga', 'CrossFit', 'Musculation', 'Cardio'],
          showInstructor: true
        }
      },
      {
        id: 'trainers',
        type: 'team',
        title: 'Nos Coachs',
        content: {
          showCertifications: true,
          showSpecialties: true
        }
      },
      {
        id: 'pricing',
        type: 'pricing',
        title: 'Abonnements',
        content: {
          plans: ['Mensuel', 'Trimestriel', 'Annuel'],
          showComparison: true
        }
      },
      {
        id: 'cta',
        type: 'cta',
        content: {
          title: 'Commencez Aujourd\'hui',
          subtitle: '7 jours d\'essai gratuit',
          button: 'Je m\'inscris'
        }
      }
    ],
    defaultColors: {
      primary: '#FF4757',
      secondary: '#2F3542',
      accent: '#FFA502'
    },
    fonts: {
      heading: 'Bebas Neue',
      body: 'Roboto'
    }
  },
  {
    id: 'hotel',
    name: 'Hôtel & Spa',
    category: 'Hôtellerie',
    description: 'Template luxueux pour hôtels et établissements spa',
    features: ['booking', 'rooms', 'amenities', 'restaurant'],
    sections: [
      {
        id: 'hero',
        type: 'hero',
        content: {
          title: '{businessName}',
          subtitle: 'Une expérience inoubliable',
          slideshow: true,
          cta: [
            { text: 'Réserver', action: 'booking' },
            { text: 'Découvrir', action: 'explore' }
          ]
        }
      },
      {
        id: 'rooms',
        type: 'services',
        title: 'Nos Chambres & Suites',
        content: {
          layout: 'luxury-cards',
          showPrices: true,
          showAmenities: true,
          show360View: true
        }
      },
      {
        id: 'amenities',
        type: 'features',
        title: 'Services & Équipements',
        content: {
          categories: ['Spa', 'Restaurant', 'Piscine', 'Fitness'],
          showImages: true
        }
      },
      {
        id: 'restaurant',
        type: 'services',
        title: 'Restaurant & Bar',
        content: {
          showMenu: true,
          showChef: true,
          reservationLink: true
        }
      },
      {
        id: 'gallery',
        type: 'gallery',
        title: 'Galerie',
        content: {
          categories: ['Chambres', 'Restaurant', 'Spa', 'Événements'],
          layout: 'fullscreen'
        }
      },
      {
        id: 'contact',
        type: 'contact',
        title: 'Contact & Accès',
        content: {
          showDirections: true,
          showAirportTransfer: true,
          showConcierge: true
        }
      }
    ],
    defaultColors: {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#E67E22'
    },
    fonts: {
      heading: 'Cormorant Garamond',
      body: 'Raleway'
    }
  },
  {
    id: 'agency',
    name: 'Agence Digitale',
    category: 'Services',
    description: 'Template créatif pour agences web et studios design',
    features: ['portfolio', 'services', 'team', 'blog'],
    sections: [
      {
        id: 'hero',
        type: 'hero',
        content: {
          title: 'Créons ensemble',
          subtitle: 'Votre vision, notre expertise',
          animation: 'particles',
          cta: [
            { text: 'Voir nos projets', action: 'portfolio' },
            { text: 'Devis gratuit', action: 'contact' }
          ]
        }
      },
      {
        id: 'services',
        type: 'services',
        title: 'Nos Services',
        content: {
          items: [
            { icon: 'design', title: 'Design UI/UX' },
            { icon: 'code', title: 'Développement' },
            { icon: 'marketing', title: 'Marketing Digital' },
            { icon: 'brand', title: 'Branding' }
          ],
          showProcess: true
        }
      },
      {
        id: 'portfolio',
        type: 'portfolio',
        title: 'Nos Réalisations',
        content: {
          filter: true,
          categories: ['Web', 'Mobile', 'Branding', 'Marketing'],
          layout: 'masonry',
          showCaseStudy: true
        }
      },
      {
        id: 'team',
        type: 'team',
        title: 'L\'Équipe',
        content: {
          showSkills: true,
          showSocial: true,
          layout: 'creative'
        }
      },
      {
        id: 'testimonials',
        type: 'testimonials',
        title: 'Ils nous font confiance',
        content: {
          showLogo: true,
          style: 'modern'
        }
      },
      {
        id: 'cta',
        type: 'cta',
        content: {
          title: 'Prêt à démarrer votre projet ?',
          subtitle: 'Contactez-nous pour un devis gratuit',
          button: 'Commencer'
        }
      }
    ],
    defaultColors: {
      primary: '#6C63FF',
      secondary: '#FF6584',
      accent: '#4ECDC4'
    },
    fonts: {
      heading: 'Space Grotesk',
      body: 'Inter'
    }
  }
]

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id)
}

export const getTemplatesByCategory = (category: string): Template[] => {
  return templates.filter(template => template.category === category)
}