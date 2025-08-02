import React, { useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import Head from 'next/head';
import '../styles/globals.css';

export default function Home() {
  useEffect(() => {
    // Apply theme to body
    const isDarkMode = localStorage.getItem('sid-hud-theme') !== 'light';
    document.body.classList.toggle('light-mode', !isDarkMode);
  }, []);

  return (
    <>
      <Head>
        <title>SID HUD - Moanna Style</title>
        <meta name="description" content="A sidebar-style HUD interface for taking notes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="app">
        <div className="content">
          <div className="welcome">
            <h1>Bienvenue dans SID HUD</h1>
            <p>Survolez la barre latérale à droite pour commencer à prendre vos notes</p>
            <div className="features">
              <div className="feature">
                <span className="icon">📝</span>
                <h3>Notes multiples</h3>
                <p>Créez et organisez vos notes avec des onglets</p>
              </div>
              <div className="feature">
                <span className="icon">💾</span>
                <h3>Sauvegarde automatique</h3>
                <p>Vos notes sont sauvegardées automatiquement</p>
              </div>
              <div className="feature">
                <span className="icon">🌙</span>
                <h3>Mode sombre/clair</h3>
                <p>Basculez entre les thèmes selon vos préférences</p>
              </div>
              <div className="feature">
                <span className="icon">📤</span>
                <h3>Export flexible</h3>
                <p>Exportez vos notes en TXT ou Markdown</p>
              </div>
            </div>
          </div>
        </div>
        
        <Sidebar />
      </main>

      <style jsx>{`
        .app {
          min-height: 100vh;
          position: relative;
        }

        .content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome {
          text-align: center;
          padding: 4rem 2rem;
        }

        .welcome h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome p {
          font-size: 1.2rem;
          margin-bottom: 3rem;
          opacity: 0.8;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .feature {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .feature:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .feature .icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .feature h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }

        .feature p {
          opacity: 0.8;
          line-height: 1.6;
        }

        /* Light mode adjustments */
        .light-mode .feature {
          background: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.1);
        }

        .light-mode .feature:hover {
          background: rgba(0, 0, 0, 0.1);
          border-color: rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .welcome h1 {
            font-size: 2rem;
          }
          
          .welcome p {
            font-size: 1rem;
          }
          
          .features {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}
