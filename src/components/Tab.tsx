import React, { useState } from 'react';
import { Note } from './Sidebar';
import styles from './Tab.module.css';

interface TabProps {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Note>) => void;
  onDelete: () => void;
}

export const Tab: React.FC<TabProps> = ({ 
  note, 
  isActive, 
  onSelect, 
  onUpdate, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);

  const handleTitleEdit = () => {
    setIsEditing(true);
    setEditTitle(note.title);
  };

  const handleTitleSave = () => {
    if (editTitle.trim()) {
      onUpdate({ title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(note.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`${styles.tab} ${isActive ? styles.active : ''}`}>
      <div className={styles.tabContent} onClick={onSelect}>
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleKeyPress}
            className={styles.titleInput}
            autoFocus
          />
        ) : (
          <div className={styles.titleContainer}>
            <span 
              className={styles.title}
              onDoubleClick={handleTitleEdit}
              title="Double-clic pour modifier"
            >
              {note.title}
            </span>
            <span className={styles.date}>
              {formatDate(note.updatedAt)}
            </span>
          </div>
        )}
      </div>
      
      <div className={styles.tabActions}>
        <button
          className={styles.editButton}
          onClick={handleTitleEdit}
          title="Modifier le titre"
        >
          ✏️
        </button>
        <button
          className={styles.deleteButton}
          onClick={onDelete}
          title="Supprimer la note"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};