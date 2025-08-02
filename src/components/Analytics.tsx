import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  totalNotes: number;
  totalWords: number;
  mostUsedCategory: string;
  productivityScore: number;
  weeklyProgress: { date: string; notes: number; words: number }[];
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  wordCountTrend: { date: string; words: number }[];
  activeHours: { hour: number; activity: number }[];
  tagsUsage: { tag: string; count: number }[];
}

interface AnalyticsProps {
  notes: any[];
  isDarkMode: boolean;
}

export function Analytics({ notes, isDarkMode }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalNotes: 0,
    totalWords: 0,
    mostUsedCategory: '',
    productivityScore: 0,
    weeklyProgress: [],
    categoryBreakdown: [],
    wordCountTrend: [],
    activeHours: [],
    tagsUsage: []
  });

  useEffect(() => {
    if (notes.length === 0) return;

    // Calculer les statistiques
    const totalWords = notes.reduce((sum, note) => {
      const words = note.content.split(/\s+/).filter((word: string) => word.length > 0);
      return sum + words.length;
    }, 0);

    // Analyse par catégorie
    const categoryCount: { [key: string]: number } = {};
    notes.forEach(note => {
      categoryCount[note.category] = (categoryCount[note.category] || 0) + 1;
    });

    const mostUsedCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    const categoryBreakdown = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / notes.length) * 100)
    }));

    // Analyse des tags
    const tagCount: { [key: string]: number } = {};
    notes.forEach(note => {
      note.tags?.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const tagsUsage = Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Progression hebdomadaire (simulation)
    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        notes: Math.floor(Math.random() * 5) + 1,
        words: Math.floor(Math.random() * 200) + 50
      };
    });

    // Tendance des mots (simulation)
    const wordCountTrend = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      return {
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        words: Math.floor(Math.random() * 500) + 100
      };
    });

    // Heures actives (simulation)
    const activeHours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: Math.floor(Math.random() * 10) + 1
    }));

    // Score de productivité (algorithme simple)
    const productivityScore = Math.min(100, Math.round(
      (notes.length * 10) + 
      (totalWords / 100) + 
      (categoryBreakdown.length * 5) +
      (tagsUsage.length * 2)
    ));

    setAnalytics({
      totalNotes: notes.length,
      totalWords,
      mostUsedCategory,
      productivityScore,
      weeklyProgress,
      categoryBreakdown,
      wordCountTrend,
      activeHours,
      tagsUsage
    });
  }, [notes]);

  const getProductivityColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#ef4444';
    return '#6b7280';
  };

  const getProductivityLevel = (score: number) => {
    if (score >= 80) return '🚀 Excellent';
    if (score >= 60) return '📈 Bon';
    if (score >= 40) return '⚠️ Moyen';
    return '📉 À améliorer';
  };

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h3>📊 Analytics & Insights</h3>
        <div className="analytics-summary">
          <div className="summary-card">
            <span className="summary-icon">📝</span>
            <div className="summary-content">
              <span className="summary-value">{analytics.totalNotes}</span>
              <span className="summary-label">Notes totales</span>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon">📖</span>
            <div className="summary-content">
              <span className="summary-value">{analytics.totalWords.toLocaleString()}</span>
              <span className="summary-label">Mots écrits</span>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon">🎯</span>
            <div className="summary-content">
              <span className="summary-value">{analytics.productivityScore}</span>
              <span className="summary-label">Score productivité</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Score de Productivité */}
        <div className="analytics-card productivity-card">
          <h4>🎯 Score de Productivité</h4>
          <div className="productivity-display">
            <div 
              className="productivity-circle"
              style={{ 
                background: `conic-gradient(${getProductivityColor(analytics.productivityScore)} ${analytics.productivityScore * 3.6}deg, #374151 ${analytics.productivityScore * 3.6}deg)` 
              }}
            >
              <div className="productivity-inner">
                <span className="productivity-score">{analytics.productivityScore}</span>
                <span className="productivity-level">{getProductivityLevel(analytics.productivityScore)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progression Hebdomadaire */}
        <div className="analytics-card">
          <h4>📈 Progression Hebdomadaire</h4>
          <div className="weekly-chart">
            {analytics.weeklyProgress.map((day, index) => (
              <div key={index} className="day-bar">
                <div 
                  className="bar-fill" 
                  style={{ height: `${(day.notes / 5) * 100}%` }}
                ></div>
                <span className="day-label">{day.date}</span>
                <span className="day-value">{day.notes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par Catégorie */}
        <div className="analytics-card">
          <h4>🗂️ Répartition par Catégorie</h4>
          <div className="category-breakdown">
            {analytics.categoryBreakdown.map((item, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-name">{item.category}</span>
                  <span className="category-count">{item.count}</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-fill"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="category-percentage">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags les Plus Utilisés */}
        <div className="analytics-card">
          <h4>🏷️ Tags Populaires</h4>
          <div className="tags-cloud">
            {analytics.tagsUsage.map((tag, index) => (
              <span 
                key={index} 
                className="tag-item"
                style={{ 
                  fontSize: `${Math.max(12, 16 - index)}px`,
                  opacity: Math.max(0.6, 1 - (index * 0.1))
                }}
              >
                #{tag.tag} ({tag.count})
              </span>
            ))}
          </div>
        </div>

        {/* Heures Actives */}
        <div className="analytics-card">
          <h4>⏰ Heures Actives</h4>
          <div className="hours-chart">
            {analytics.activeHours.map((hour, index) => (
              <div key={index} className="hour-bar">
                <div 
                  className="hour-fill"
                  style={{ height: `${(hour.activity / 10) * 100}%` }}
                ></div>
                <span className="hour-label">{hour.hour}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="analytics-card insights-card">
          <h4>💡 Insights</h4>
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-icon">🎯</span>
              <span className="insight-text">
                Catégorie préférée : <strong>{analytics.mostUsedCategory}</strong>
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📈</span>
              <span className="insight-text">
                Moyenne : <strong>{Math.round(analytics.totalWords / Math.max(1, analytics.totalNotes))}</strong> mots par note
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🏷️</span>
              <span className="insight-text">
                <strong>{analytics.tagsUsage.length}</strong> tags différents utilisés
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📊</span>
              <span className="insight-text">
                <strong>{analytics.categoryBreakdown.length}</strong> catégories actives
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}