import React, { useState, useEffect, useRef } from 'react';
import { NotesManager } from './NotesManager';

interface SidebarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function Sidebar({ isDarkMode, setIsDarkMode }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300); // 300ms delay before closing
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-toggle">
          <span className="sidebar-icon">📝</span>
          {isExpanded && (
            <div className="sidebar-title-section">
              <h2 className="sidebar-title">SID HUD</h2>
              <div className="sid-subtitle">Interface de Notes Intelligente</div>
              <button 
                className="theme-toggle"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          )}
          {!isExpanded && (
            <div className="sid-collapsed">
              <span className="sid-label">SID</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {isExpanded && (
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher dans les notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}

      {/* Notes Manager */}
      {isExpanded && (
        <div className="notes-container">
          <NotesManager searchTerm={searchTerm} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* Sidebar Footer */}
      {isExpanded && (
        <div className="sidebar-footer">
          <div className="footer-stats">
            <span className="stat-item">💾 Auto-save activé</span>
          </div>
        </div>
      )}
    </div>
  );
}