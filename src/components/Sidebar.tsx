import React, { useState, useEffect, useRef } from 'react';
import { Tab } from './Tab';
import { NoteEditor } from './NoteEditor';
import { ThemeToggle } from './ThemeToggle';
import { ExportButton } from './ExportButton';
import styles from './Sidebar.module.css';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('sid-hud-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
      if (parsedNotes.length > 0 && !activeTabId) {
        setActiveTabId(parsedNotes[0].id);
      }
    } else {
      // Create default note
      const defaultNote: Note = {
        id: 'default',
        title: 'Note 1',
        content: 'Bienvenue dans SID HUD!\n\nCommencez à prendre vos notes ici...',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes([defaultNote]);
      setActiveTabId(defaultNote.id);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('sid-hud-notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Auto-expand on hover, collapse after delay
  useEffect(() => {
    if (isHovering) {
      setIsExpanded(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const addNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: `Note ${notes.length + 1}`,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([...notes, newNote]);
    setActiveTabId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
    
    if (activeTabId === id) {
      setActiveTabId(filteredNotes.length > 0 ? filteredNotes[0].id : null);
    }
  };

  const activeNote = notes.find(note => note.id === activeTabId);

  return (
    <div 
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed} ${isDarkMode ? styles.dark : styles.light}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>SID HUD</h1>
        <div className={styles.controls}>
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <ExportButton notes={notes} />
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          {notes.map(note => (
            <Tab
              key={note.id}
              note={note}
              isActive={note.id === activeTabId}
              onSelect={() => setActiveTabId(note.id)}
              onUpdate={(updates) => updateNote(note.id, updates)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
          <button 
            className={styles.addTabButton}
            onClick={addNote}
            title="Ajouter une note"
          >
            +
          </button>
        </div>
      </div>

      {activeNote && (
        <div className={styles.editorContainer}>
          <NoteEditor
            note={activeNote}
            onUpdate={(updates) => updateNote(activeNote.id, updates)}
          />
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.status}>
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};