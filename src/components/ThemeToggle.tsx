import React from 'react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, setIsDarkMode }) => {
  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      className={`${styles.themeToggle} ${isDarkMode ? styles.dark : styles.light}`}
      onClick={handleToggle}
      title={isDarkMode ? 'Passer au mode clair' : 'Passer au mode sombre'}
    >
      <div className={styles.icon}>
        {isDarkMode ? '☀️' : '🌙'}
      </div>
    </button>
  );
};