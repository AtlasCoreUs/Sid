import React, { useState } from 'react';
import { Note } from './Sidebar';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  notes: Note[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ notes }) => {
  const [showMenu, setShowMenu] = useState(false);

  const exportAsTxt = () => {
    const content = notes.map(note => {
      return `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}\n\n---\n\n`;
    }).join('');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const exportAsMd = () => {
    const content = notes.map(note => {
      return `# ${note.title}\n\n${note.content}\n\n---\n\n`;
    }).join('');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const exportAll = () => {
    const content = notes.map(note => {
      return `# ${note.title}\n\n**Créé le:** ${note.createdAt.toLocaleString('fr-FR')}\n**Modifié le:** ${note.updatedAt.toLocaleString('fr-FR')}\n\n${note.content}\n\n---\n\n`;
    }).join('');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toutes-les-notes-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  return (
    <div className={styles.exportContainer}>
      <button
        className={styles.exportButton}
        onClick={() => setShowMenu(!showMenu)}
        title="Exporter les notes"
      >
        📤
      </button>
      
      {showMenu && (
        <div className={styles.exportMenu}>
          <button 
            className={styles.exportOption}
            onClick={exportAsTxt}
            title="Exporter en format texte"
          >
            📄 TXT
          </button>
          <button 
            className={styles.exportOption}
            onClick={exportAsMd}
            title="Exporter en format Markdown"
          >
            📝 MD
          </button>
          <button 
            className={styles.exportOption}
            onClick={exportAll}
            title="Exporter toutes les notes avec métadonnées"
          >
            📚 Tout
          </button>
        </div>
      )}
    </div>
  );
};