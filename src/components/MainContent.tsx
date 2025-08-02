import React from 'react';

interface MainContentProps {
  isDarkMode: boolean;
}

export default function MainContent({ isDarkMode }: MainContentProps) {
  return (
    <div className="main-content">
      <div className="content-container">
        <header className="main-header">
          <h1>🚀 SID HUD - Interface de Notes Avancée</h1>
          <p className="subtitle">
            Une sidebar moderne qui s'active au survol pour prendre des notes efficacement
          </p>
        </header>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Notes Intelligentes</h3>
            <p>Système de notes avec catégories, recherche et auto-sauvegarde</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Mode Sombre/Clair</h3>
            <p>Interface adaptative avec thème sombre et clair</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Auto-sauvegarde</h3>
            <p>Vos notes sont automatiquement sauvegardées en temps réel</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📤</div>
            <h3>Export Multiple</h3>
            <p>Exportez vos notes en format TXT ou Markdown</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Recherche Avancée</h3>
            <p>Trouvez rapidement vos notes par titre ou contenu</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗂️</div>
            <h3>Organisation</h3>
            <p>Organisez vos notes par catégories personnalisables</p>
          </div>
        </div>

        <div className="demo-section">
          <h2>💡 Comment utiliser</h2>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <p>Survolez la sidebar à gauche pour l'ouvrir</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>Cliquez sur ➕ pour créer une nouvelle note</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>Écrivez votre contenu - il se sauvegarde automatiquement</p>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <p>Utilisez les boutons d'export pour télécharger vos notes</p>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>📊 Statistiques</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">∞</span>
              <span className="stat-label">Notes illimitées</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">⚡</span>
              <span className="stat-label">Sauvegarde instantanée</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">🔒</span>
              <span className="stat-label">Stockage local sécurisé</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">📱</span>
              <span className="stat-label">Interface responsive</span>
            </div>
          </div>
        </div>

        <footer className="main-footer">
          <p>Développé avec ❤️ pour une prise de notes optimale</p>
          <div className="tech-stack">
            <span className="tech-item">Next.js</span>
            <span className="tech-item">React</span>
            <span className="tech-item">TypeScript</span>
            <span className="tech-item">CSS3</span>
          </div>
        </footer>
      </div>
    </div>
  );
}