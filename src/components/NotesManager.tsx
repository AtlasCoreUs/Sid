import React, { useState, useEffect, useRef } from 'react';

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  options?: any;
}

interface ImageData {
  url: string;
  alt: string;
  caption?: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  tags: string[];
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  // Nouvelles fonctionnalités
  type: 'text' | 'chart' | 'template' | 'image';
  chartData?: ChartData;
  images?: ImageData[];
  templateId?: string;
  isEncrypted?: boolean;
  priority?: 'low' | 'medium' | 'high';
  status?: 'draft' | 'published' | 'archived';
  linkedNotes?: string[]; // IDs des notes liées
  metadata?: {
    wordCount: number;
    characterCount: number;
    readingTime: number;
    lastAccessed: Date;
    accessCount: number;
  };
}

interface NotesManagerProps {
  searchTerm: string;
  isDarkMode: boolean;
}

export function NotesManager({ searchTerm, isDarkMode }: NotesManagerProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['Général', 'Idées', 'TODO', 'Projets', 'Urgent', 'Graphiques', 'Templates']);
  const [selectedCategory, setSelectedCategory] = useState<string>('Général');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [recentNotes, setRecentNotes] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [selectedNoteType, setSelectedNoteType] = useState<'text' | 'chart' | 'template' | 'image'>('text');
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalNotes: 0,
    totalWords: 0,
    mostUsedCategory: '',
    productivityScore: 0,
    weeklyProgress: [] as { date: string; notes: number; words: number }[]
  });
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Templates prédéfinis
  const defaultTemplates: Template[] = [
    {
      id: 'meeting',
      name: '📅 Réunion',
      content: `# Réunion - [Titre]

## 📋 Ordre du jour
- [ ] Point 1
- [ ] Point 2
- [ ] Point 3

## 👥 Participants
- 

## 📝 Notes
- 

## ✅ Actions à suivre
- [ ] Action 1 - Assigné à: - Date: 
- [ ] Action 2 - Assigné à: - Date: 

## 📅 Prochaine réunion
Date: 
Heure: 
`,
      category: 'Templates',
      tags: ['réunion', 'professionnel']
    },
    {
      id: 'project',
      name: '🚀 Projet',
      content: `# Projet - [Nom du projet]

## 🎯 Objectifs
- 

## 📋 Tâches
### Phase 1
- [ ] Tâche 1
- [ ] Tâche 2

### Phase 2
- [ ] Tâche 3
- [ ] Tâche 4

## 📊 Budget
- Estimation: 
- Dépensé: 
- Restant: 

## ⏰ Timeline
- Début: 
- Fin prévue: 
- Jalons: 

## 🛠 Ressources
- 

## 📈 Métriques
- 
`,
      category: 'Templates',
      tags: ['projet', 'gestion']
    },
    {
      id: 'chart',
      name: '📊 Graphique',
      content: `# Graphique - [Titre]

## 📈 Données
- Série 1: 
- Série 2: 
- Série 3: 

## 🎨 Configuration
- Type: Bar/Line/Pie/Doughnut
- Couleurs: 
- Échelle: 

## 📊 Résultats
- 

## 💡 Insights
- 
`,
      category: 'Templates',
      tags: ['graphique', 'données', 'analyse']
    }
  ];

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('sid-hud-notes');
    const savedRecent = localStorage.getItem('sid-hud-recent');
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        tags: note.tags || [],
        // Handle new fields
        type: note.type || 'text',
        chartData: note.chartData || undefined,
        images: note.images || undefined,
        templateId: note.templateId || undefined,
        isEncrypted: note.isEncrypted || false,
        priority: note.priority || undefined,
        status: note.status || undefined,
        linkedNotes: note.linkedNotes || undefined,
        metadata: note.metadata || undefined
      }));
      setNotes(parsedNotes);
      if (parsedNotes.length > 0 && !activeNoteId) {
        setActiveNoteId(parsedNotes[0].id);
      }
    } else {
      // Create default example notes
      const defaultNotes: Note[] = [
        {
          id: '1',
          title: '🚀 Bienvenue dans SID HUD',
          content: `Bienvenue dans votre nouveau système de notes intelligent !

# Fonctionnalités principales

## 📝 Prise de notes avancée
- **Auto-sauvegarde** : Vos notes sont sauvegardées automatiquement
- **Recherche puissante** : Trouvez vos notes rapidement
- **Catégories** : Organisez vos idées par thème
- **Export** : Téléchargez en TXT ou Markdown

## ⌨️ Raccourcis clavier
- **Ctrl+N** : Nouvelle note
- **Ctrl+S** : Sauvegarder
- **Ctrl+E** : Exporter
- **Ctrl+F** : Rechercher

## 🎨 Interface moderne
- Mode sombre/clair
- Sidebar qui s'ouvre au survol
- Design responsive
- Animations fluides

Commencez à créer vos propres notes en cliquant sur le bouton ➕ !`,
          category: 'Général',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['guide', 'aide'],
          type: 'text'
        },
        {
          id: '2',
          title: '💡 Idées de projets',
          content: `# Mes idées de projets

## Applications Web
- [ ] Site portfolio personnel
- [ ] Générateur de QR codes
- [ ] Calculatrice de pourboires
- [ ] Météo locale

## Automatisations
- [ ] Script de sauvegarde automatique
- [ ] Bot Discord pour serveur
- [ ] Système de rappels par email

## Apprentissage
- [ ] Tutoriel React avancé
- [ ] Formation TypeScript
- [ ] Cours d'UI/UX design

## Notes
Utiliser cette section pour brainstormer et planifier vos futurs projets !`,
          category: 'Idées',
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000),
          tags: ['projets', 'todo', 'développement'],
          type: 'text'
        },
        {
          id: '3',
          title: '📋 TODO de la semaine',
          content: `# Ma liste de tâches

## 🔥 Urgent
- [x] Finir la présentation client
- [ ] Répondre aux emails importants
- [ ] Préparer la réunion équipe

## 📅 Cette semaine
- [ ] Réviser le code du projet SID HUD
- [ ] Mettre à jour la documentation
- [ ] Tester les nouvelles fonctionnalités
- [ ] Optimiser les performances

## 🏠 Personnel
- [ ] Faire les courses
- [ ] Planifier le weekend
- [ ] Appeler la famille

## 📚 Apprentissage
- [ ] Lire article sur React 18
- [ ] Regarder conférence tech
- [ ] Pratiquer les algorithmes

N'oubliez pas de cocher ✅ les tâches terminées !`,
          category: 'TODO',
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
          tags: ['urgent', 'travail', 'personnel'],
          type: 'text'
        }
      ];
      
      setNotes(defaultNotes);
      setActiveNoteId(defaultNotes[0].id);
      setRecentNotes([defaultNotes[0].id, defaultNotes[2].id]);
    }
    
    if (savedRecent) {
      setRecentNotes(JSON.parse(savedRecent));
    }
  }, []);

  // Auto-save notes to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('sid-hud-notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Save recent notes
  useEffect(() => {
    if (recentNotes.length > 0) {
      localStorage.setItem('sid-hud-recent', JSON.stringify(recentNotes));
    }
  }, [recentNotes]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            setShowNewNoteForm(true);
            break;
          case 's':
            e.preventDefault();
            if (activeNote) {
              // Force save
              saveNote();
            }
            break;
          case 'e':
            e.preventDefault();
            if (activeNote) {
              exportNote('md');
            }
            break;
          case 'f':
            e.preventDefault();
            const searchInput = document.querySelector('.search-input') as HTMLInputElement;
            searchInput?.focus();
            break;
        }
      }
      
      if (e.key === 'Escape') {
        setShowNewNoteForm(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeNoteId, notes]);

  // Update word count when active note changes
  useEffect(() => {
    if (activeNote) {
      const words = activeNote.content.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [activeNoteId, notes]);

  // Filter notes based on search term and category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Toutes' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeNote = notes.find(note => note.id === activeNoteId);

  // Add to recent notes
  const addToRecent = (noteId: string) => {
    setRecentNotes(prev => {
      const filtered = prev.filter(id => id !== noteId);
      return [noteId, ...filtered].slice(0, 5); // Keep only 5 recent notes
    });
  };

  const createNewNote = () => {
    if (!newNoteTitle.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: '',
      category: selectedCategory,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      type: selectedNoteType, // Use selected note type
      // Initialize new fields based on type
      chartData: selectedNoteType === 'chart' ? { type: 'bar', data: { labels: [], datasets: [{ label: 'Data', data: [] }] } } : undefined,
      images: selectedNoteType === 'image' ? [] : undefined,
      templateId: selectedNoteType === 'template' ? defaultTemplates[0].id : undefined, // Default to first template
      isEncrypted: false, // Default to false
      priority: undefined, // Default to undefined
      status: undefined, // Default to undefined
      linkedNotes: undefined, // Default to undefined
      metadata: undefined // Default to undefined
    };

    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    addToRecent(newNote.id);
    setNewNoteTitle('');
    setShowNewNoteForm(false);
    
    // Focus on textarea after creating note
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const saveNote = () => {
    if (!activeNoteId || !activeNote) return;
    
    // This will trigger the auto-save effect
    setNotes(prev => prev.map(note =>
      note.id === activeNoteId
        ? { ...note, updatedAt: new Date() }
        : note
    ));
  };

  const updateNoteContent = (content: string) => {
    if (!activeNoteId) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Update immediately for UI responsiveness
    setNotes(prev => prev.map(note =>
      note.id === activeNoteId
        ? { ...note, content }
        : note
    ));

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      setNotes(prev => prev.map(note =>
        note.id === activeNoteId
          ? { ...note, content, updatedAt: new Date() }
          : note
      ));
    }, 1000); // Auto-save after 1 second of inactivity
  };

  const updateNoteTitle = (title: string) => {
    if (!activeNoteId || !title.trim()) return;
    
    setNotes(prev => prev.map(note =>
      note.id === activeNoteId
        ? { ...note, title, updatedAt: new Date() }
        : note
    ));
  };

  const selectNote = (noteId: string) => {
    setActiveNoteId(noteId);
    addToRecent(noteId);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    setRecentNotes(prev => prev.filter(id => id !== noteId));
    
    if (activeNoteId === noteId) {
      const remainingNotes = notes.filter(note => note.id !== noteId);
      setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
    }
  };

  const duplicateNote = (noteId: string) => {
    const noteToDuplicate = notes.find(note => note.id === noteId);
    if (!noteToDuplicate) return;

    const duplicatedNote: Note = {
      ...noteToDuplicate,
      id: Date.now().toString(),
      title: `${noteToDuplicate.title} (Copie)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes(prev => [duplicatedNote, ...prev]);
    setActiveNoteId(duplicatedNote.id);
    addToRecent(duplicatedNote.id);
  };

  const exportNote = (format: 'txt' | 'md') => {
    if (!activeNote) return;

    const content = format === 'md' 
      ? `# ${activeNote.title}\n\n${activeNote.content}\n\n---\n*Catégorie: ${activeNote.category}*\n*Créé le: ${activeNote.createdAt.toLocaleDateString()}*\n*Modifié le: ${activeNote.updatedAt.toLocaleDateString()}*`
      : `${activeNote.title}\n${'='.repeat(activeNote.title.length)}\n\n${activeNote.content}\n\nCatégorie: ${activeNote.category}\nCréé le: ${activeNote.createdAt.toLocaleDateString()}\nModifié le: ${activeNote.updatedAt.toLocaleDateString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllNotes = (format: 'txt' | 'md') => {
    if (notes.length === 0) return;

    const content = notes.map(note => 
      format === 'md'
        ? `# ${note.title}\n\n${note.content}\n\n*Catégorie: ${note.category}* | *${note.updatedAt.toLocaleDateString()}*\n\n---\n`
        : `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}\n\nCatégorie: ${note.category} | ${note.updatedAt.toLocaleDateString()}\n\n${'='.repeat(50)}\n`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toutes-les-notes-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get recent notes for quick access
  const recentNotesData = recentNotes
    .map(id => notes.find(note => note.id === id))
    .filter(Boolean)
    .slice(0, 3) as Note[];

  return (
    <div className="notes-manager">
      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="shortcuts-info">
          <span className="shortcut-item" title="Nouvelle note">Ctrl+N</span>
          <span className="shortcut-item" title="Sauvegarder">Ctrl+S</span>
          <span className="shortcut-item" title="Exporter">Ctrl+E</span>
          <span className="shortcut-item" title="Rechercher">Ctrl+F</span>
        </div>
      </div>

      {/* Recent Notes */}
      {recentNotesData.length > 0 && (
        <div className="recent-notes">
          <h4>📋 Récentes</h4>
          <div className="recent-items">
            {recentNotesData.map(note => (
              <div
                key={note.id}
                className={`recent-item ${note.id === activeNoteId ? 'active' : ''}`}
                onClick={() => selectNote(note.id)}
                title={note.title}
              >
                <span className="recent-title">{note.title}</span>
                <span className="recent-time">
                  {note.updatedAt.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="category-section">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="Toutes">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        <div className="notes-header">
          <h3>Notes ({filteredNotes.length})</h3>
          <button
            className="new-note-btn"
            onClick={() => setShowNewNoteForm(true)}
            title="Nouvelle note (Ctrl+N)"
          >
            ➕
          </button>
        </div>

        {showNewNoteForm && (
          <div className="new-note-form">
            <input
              type="text"
              placeholder="Titre de la note..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') createNewNote();
                if (e.key === 'Escape') setShowNewNoteForm(false);
              }}
              className="new-note-input"
              autoFocus
            />
            <div className="form-buttons">
              <button onClick={createNewNote} className="btn-create">✓</button>
              <button onClick={() => setShowNewNoteForm(false)} className="btn-cancel">✗</button>
            </div>
          </div>
        )}

        <div className="notes-items">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={`note-item ${note.id === activeNoteId ? 'active' : ''}`}
              onClick={() => selectNote(note.id)}
            >
              <div className="note-header">
                <span className="note-title">{note.title}</span>
                <div className="note-actions">
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateNote(note.id);
                    }}
                    title="Dupliquer"
                  >
                    📋
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="note-meta">
                <span className="note-category">{note.category}</span>
                <span className="note-date">
                  {note.updatedAt.toLocaleDateString()}
                </span>
              </div>
              <div className="note-preview">
                {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
              </div>
              {note.tags.length > 0 && (
                <div className="note-tags">
                  {note.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note Editor */}
      {activeNote && (
        <div className="note-editor">
          <div className="editor-header">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateNoteTitle(e.target.value)}
              className="note-title-input"
              placeholder="Titre de la note..."
            />
            <div className="editor-actions">
              <button
                onClick={() => exportNote('txt')}
                className="export-btn"
                title="Exporter en TXT"
              >
                📄
              </button>
              <button
                onClick={() => exportNote('md')}
                className="export-btn"
                title="Exporter en Markdown (Ctrl+E)"
              >
                📝
              </button>
            </div>
          </div>
          
          <div className="editor-stats">
            <span className="stat">📝 {wordCount} mots</span>
            <span className="stat">📏 {activeNote.content.length} caractères</span>
            <span className="stat">🕒 {activeNote.updatedAt.toLocaleTimeString()}</span>
          </div>
          
          <textarea
            ref={textareaRef}
            value={activeNote.content}
            onChange={(e) => updateNoteContent(e.target.value)}
            placeholder="Commencez à écrire votre note...

💡 Astuces :
• Ctrl+N : Nouvelle note
• Ctrl+S : Sauvegarder
• Ctrl+E : Exporter
• Ctrl+F : Rechercher"
            className="note-textarea"
          />
        </div>
      )}

      {/* Export All */}
      {notes.length > 0 && (
        <div className="export-all-section">
          <h4>📤 Exporter toutes les notes</h4>
          <div className="export-buttons">
            <button
              onClick={() => exportAllNotes('txt')}
              className="export-all-btn"
            >
              📄 TXT
            </button>
            <button
              onClick={() => exportAllNotes('md')}
              className="export-all-btn"
            >
              📝 Markdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}