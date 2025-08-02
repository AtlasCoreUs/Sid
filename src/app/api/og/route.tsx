import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Récupérer les paramètres
    const title = searchParams.get('title') || 'SID HUD'
    const description = searchParams.get('description') || 'Créez des apps incroyables'
    const template = searchParams.get('template')
    const gradient = searchParams.get('gradient') || 'purple'

    // Gradients prédéfinis
    const gradients = {
      purple: 'from-purple-600 to-pink-600',
      blue: 'from-blue-600 to-cyan-600',
      green: 'from-green-600 to-emerald-600',
      orange: 'from-orange-600 to-red-600',
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            backgroundImage: `linear-gradient(to bottom right, #8B5CF6, #EC4899)`,
          }}
        >
          {/* Effet de grille futuriste */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.05) 50px, rgba(255,255,255,0.05) 51px),
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.05) 50px, rgba(255,255,255,0.05) 51px)
              `,
            }}
          />

          {/* Orbe lumineux */}
          <div
            style={{
              position: 'absolute',
              width: 600,
              height: 600,
              background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />

          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: 20 }}
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: 60,
                fontWeight: 900,
                color: 'white',
                letterSpacing: '-0.05em',
              }}
            >
              SID HUD
            </span>
          </div>

          {/* Titre principal */}
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              textAlign: 'center',
              marginBottom: 30,
              maxWidth: '80%',
              textShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              maxWidth: '70%',
              marginBottom: 40,
            }}
          >
            {description}
          </div>

          {/* Template badge si présent */}
          {template && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span style={{ color: 'white', fontSize: 24 }}>
                Template: {template}
              </span>
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              color: 'rgba(255,255,255,0.6)',
              fontSize: 20,
            }}
          >
            <span>Créez votre app en 5 minutes</span>
            <span>•</span>
            <span>IA intégrée</span>
            <span>•</span>
            <span>100% personnalisable</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}