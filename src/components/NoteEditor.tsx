import React, { useState, useEffect, useRef } from 'react';
import { Note } from './Sidebar';
import styles from './NoteEditor.module.css';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdate }) => {
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update content when note changes
  useEffect(() => {
    setContent(note.content);
  }, [note.id, note.content]);

  // Auto-save functionality
  useEffect(() => {
    if (content !== note.content) {
      setIsSaving(true);
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        onUpdate({ content });
        setIsSaving(false);
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, note.content, onUpdate]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key support
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      setContent(newContent);
      
      // Set cursor position after tab
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleWordCount = () => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  };

  const handleCharacterCount = () => {
    return content.length;
  };

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            {handleWordCount()} mots
          </span>
          <span className={styles.stat}>
            {handleCharacterCount()} caractères
          </span>
        </div>
        <div className={styles.saveStatus}>
          {isSaving ? (
            <span className={styles.saving}>Sauvegarde...</span>
          ) : (
            <span className={styles.saved}>Sauvegardé</span>
          )}
        </div>
      </div>

      <div className={styles.textareaContainer}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          className={styles.textarea}
          placeholder="Commencez à écrire votre note ici..."
          autoFocus
        />
      </div>

      <div className={styles.editorFooter}>
        <div className={styles.shortcuts}>
          <span className={styles.shortcut}>Tab</span>
          <span className={styles.shortcutDesc}>Indentation</span>
          <span className={styles.shortcut}>Ctrl+S</span>
          <span className={styles.shortcutDesc}>Sauvegarde auto</span>
        </div>
      </div>
    </div>
  );
};