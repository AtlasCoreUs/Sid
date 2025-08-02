import React, { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  description: string;
  type: 'liquid-glass' | 'neon' | 'minimal' | 'gradient' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  effects: {
    glassOpacity: number;
    blurAmount: number;
    borderGlow: boolean;
    shadowIntensity: number;
    animationSpeed: number;
  };
  css: string;
}

interface ThemeManagerProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeManager({ isDarkMode, setIsDarkMode, onThemeChange }: ThemeManagerProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>('liquid-glass-dark');
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#1f2937',
    accent: '#10b981',
    background: '#111827',
    surface: '#1f2937',
    text: '#ffffff',
    textSecondary: '#d1d5db'
  });

  const predefinedThemes: Theme[] = [
    {
      id: 'liquid-glass-dark',
      name: '🌊 Liquid Glass Dark',
      description: 'Effet verre liquide avec thème sombre',
      type: 'liquid-glass',
      colors: {
        primary: '#3b82f6',
        secondary: '#1f2937',
        accent: '#10b981',
        background: '#0f172a',
        surface: 'rgba(30, 41, 59, 0.8)',
        text: '#ffffff',
        textSecondary: '#cbd5e1'
      },
      effects: {
        glassOpacity: 0.8,
        blurAmount: 20,
        borderGlow: true,
        shadowIntensity: 0.3,
        animationSpeed: 0.3
      },
      css: `
        .sidebar, .analytics-card, .chart-builder {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .sidebar::before, .analytics-card::before, .chart-builder::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
          border-radius: inherit;
          z-index: -1;
        }
        
        .note-item:hover, .feature-card:hover {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }
      `
    },
    {
      id: 'liquid-glass-light',
      name: '🌊 Liquid Glass Light',
      description: 'Effet verre liquide avec thème clair',
      type: 'liquid-glass',
      colors: {
        primary: '#3b82f6',
        secondary: '#f8fafc',
        accent: '#10b981',
        background: '#ffffff',
        surface: 'rgba(248, 250, 252, 0.8)',
        text: '#1e293b',
        textSecondary: '#64748b'
      },
      effects: {
        glassOpacity: 0.9,
        blurAmount: 15,
        borderGlow: false,
        shadowIntensity: 0.1,
        animationSpeed: 0.3
      },
      css: `
        .sidebar, .analytics-card, .chart-builder {
          background: rgba(248, 250, 252, 0.9);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(203, 213, 225, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .note-item:hover, .feature-card:hover {
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
      `
    },
    {
      id: 'neon-dark',
      name: '✨ Neon Dark',
      description: 'Thème néon avec effets lumineux',
      type: 'neon',
      colors: {
        primary: '#00ffff',
        secondary: '#1a1a1a',
        accent: '#ff00ff',
        background: '#000000',
        surface: '#1a1a1a',
        text: '#ffffff',
        textSecondary: '#cccccc'
      },
      effects: {
        glassOpacity: 0.7,
        blurAmount: 10,
        borderGlow: true,
        shadowIntensity: 0.5,
        animationSpeed: 0.2
      },
      css: `
        .sidebar, .analytics-card, .chart-builder {
          background: rgba(26, 26, 26, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid #00ffff;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }
        
        .note-item:hover, .feature-card:hover {
          border: 1px solid #ff00ff;
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.4);
        }
        
        .btn:hover {
          box-shadow: 0 0 10px currentColor;
        }
      `
    },
    {
      id: 'minimal-dark',
      name: '⚪ Minimal Dark',
      description: 'Design minimaliste épuré',
      type: 'minimal',
      colors: {
        primary: '#ffffff',
        secondary: '#1a1a1a',
        accent: '#666666',
        background: '#000000',
        surface: '#1a1a1a',
        text: '#ffffff',
        textSecondary: '#999999'
      },
      effects: {
        glassOpacity: 1,
        blurAmount: 0,
        borderGlow: false,
        shadowIntensity: 0,
        animationSpeed: 0.1
      },
      css: `
        .sidebar, .analytics-card, .chart-builder {
          background: #1a1a1a;
          border: 1px solid #333333;
          box-shadow: none;
        }
        
        .note-item:hover, .feature-card:hover {
          background: #2a2a2a;
          border: 1px solid #ffffff;
        }
      `
    },
    {
      id: 'gradient-dark',
      name: '🌈 Gradient Dark',
      description: 'Thème avec dégradés colorés',
      type: 'gradient',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f093fb',
        background: '#667eea',
        surface: 'rgba(102, 126, 234, 0.8)',
        text: '#ffffff',
        textSecondary: '#e0e0e0'
      },
      effects: {
        glassOpacity: 0.8,
        blurAmount: 25,
        borderGlow: true,
        shadowIntensity: 0.4,
        animationSpeed: 0.4
      },
      css: `
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .sidebar, .analytics-card, .chart-builder {
          background: rgba(102, 126, 234, 0.8);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(240, 147, 251, 0.3);
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }
        
        .note-item:hover, .feature-card:hover {
          background: rgba(240, 147, 251, 0.1);
          border: 1px solid rgba(240, 147, 251, 0.5);
          box-shadow: 0 0 20px rgba(240, 147, 251, 0.3);
        }
      `
    }
  ];

  useEffect(() => {
    const theme = predefinedThemes.find(t => t.id === selectedTheme);
    if (theme) {
      applyTheme(theme);
      onThemeChange(theme);
    }
  }, [selectedTheme]);

  const applyTheme = (theme: Theme) => {
    // Appliquer les couleurs CSS
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Appliquer les effets
    root.style.setProperty('--glass-opacity', theme.effects.glassOpacity.toString());
    root.style.setProperty('--blur-amount', `${theme.effects.blurAmount}px`);
    root.style.setProperty('--shadow-intensity', theme.effects.shadowIntensity.toString());
    root.style.setProperty('--animation-speed', `${theme.effects.animationSpeed}s`);

    // Injecter le CSS personnalisé
    let styleElement = document.getElementById('theme-custom-css');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-custom-css';
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = theme.css;
  };

  const handleCustomTheme = () => {
    const customTheme: Theme = {
      id: 'custom',
      name: '🎨 Thème Personnalisé',
      description: 'Vos couleurs personnalisées',
      type: 'custom',
      colors: customColors,
      effects: {
        glassOpacity: 0.8,
        blurAmount: 20,
        borderGlow: true,
        shadowIntensity: 0.3,
        animationSpeed: 0.3
      },
      css: `
        .sidebar, .analytics-card, .chart-builder {
          background: rgba(${parseInt(customColors.surface.slice(1, 3), 16)}, ${parseInt(customColors.surface.slice(3, 5), 16)}, ${parseInt(customColors.surface.slice(5, 7), 16)}, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid ${customColors.primary}40;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
      `
    };
    applyTheme(customTheme);
    onThemeChange(customTheme);
  };

  return (
    <div className="theme-manager">
      <div className="theme-header">
        <h3>🎨 Gestionnaire de Thèmes</h3>
        <div className="theme-toggle">
          <button
            className={`theme-btn ${isDarkMode ? 'active' : ''}`}
            onClick={() => setIsDarkMode(true)}
          >
            🌙 Sombre
          </button>
          <button
            className={`theme-btn ${!isDarkMode ? 'active' : ''}`}
            onClick={() => setIsDarkMode(false)}
          >
            ☀️ Clair
          </button>
        </div>
      </div>

      <div className="themes-grid">
        {predefinedThemes.map(theme => (
          <div
            key={theme.id}
            className={`theme-card ${selectedTheme === theme.id ? 'selected' : ''}`}
            onClick={() => setSelectedTheme(theme.id)}
          >
            <div className="theme-preview" style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
              border: `1px solid ${theme.colors.primary}40`
            }}>
              <div className="preview-sidebar" style={{
                background: theme.colors.surface,
                backdropFilter: `blur(${theme.effects.blurAmount}px)`
              }}></div>
              <div className="preview-content" style={{
                background: theme.colors.background
              }}></div>
            </div>
            <div className="theme-info">
              <h4>{theme.name}</h4>
              <p>{theme.description}</p>
              <div className="theme-type">{theme.type}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="custom-theme-section">
        <h4>🎨 Personnaliser les Couleurs</h4>
        <div className="color-picker-grid">
          {Object.entries(customColors).map(([key, value]) => (
            <div key={key} className="color-picker">
              <label>{key}</label>
              <input
                type="color"
                value={value}
                onChange={(e) => setCustomColors(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
                className="color-input"
              />
            </div>
          ))}
        </div>
        <button onClick={handleCustomTheme} className="apply-custom-btn">
          🎨 Appliquer le Thème Personnalisé
        </button>
      </div>

      <div className="theme-effects">
        <h4>✨ Effets Visuels</h4>
        <div className="effects-grid">
          <div className="effect-item">
            <label>Transparence du verre</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="0.8"
              onChange={(e) => {
                document.documentElement.style.setProperty('--glass-opacity', e.target.value);
              }}
            />
          </div>
          <div className="effect-item">
            <label>Intensité du flou</label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              defaultValue="20"
              onChange={(e) => {
                document.documentElement.style.setProperty('--blur-amount', `${e.target.value}px`);
              }}
            />
          </div>
          <div className="effect-item">
            <label>Intensité des ombres</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="0.3"
              onChange={(e) => {
                document.documentElement.style.setProperty('--shadow-intensity', e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}