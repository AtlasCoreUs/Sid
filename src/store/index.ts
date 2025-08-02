import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type {
  Note,
  Category,
  Tag,
  User,
  UserPreferences,
  Workspace,
  SearchResult,
  Notification,
  Toast,
  ModalState,
  LoadingState,
  SyncStatus,
  Analytics,
  AIAnalysis,
} from '../types';

interface AppState {
  // Core data
  notes: Note[];
  categories: Category[];
  tags: Tag[];
  currentUser: User | null;
  currentWorkspace: Workspace | null;
  
  // UI state
  isDarkMode: boolean;
  sidebarExpanded: boolean;
  activeNoteId: string | null;
  selectedCategory: string;
  searchTerm: string;
  searchResults: SearchResult[];
  
  // Modals and overlays
  modals: Record<string, ModalState>;
  toasts: Toast[];
  notifications: Notification[];
  
  // Loading states
  loadingStates: Record<string, LoadingState>;
  
  // Sync and analytics
  syncStatus: SyncStatus;
  analytics: Analytics | null;
  
  // AI features
  aiAnalysis: Record<string, AIAnalysis>;
  
  // Actions
  setDarkMode: (isDark: boolean) => void;
  toggleSidebar: () => void;
  setActiveNote: (noteId: string | null) => void;
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  duplicateNote: (id: string) => void;
  archiveNote: (id: string) => void;
  restoreNote: (id: string) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Tag actions
  addTag: (tag: Omit<Tag, 'id' | 'createdAt'>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  // Modal actions
  openModal: (type: string, data?: unknown) => void;
  closeModal: (type: string) => void;
  
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  
  // Loading actions
  setLoading: (key: string, loading: LoadingState) => void;
  clearLoading: (key: string) => void;
  
  // Sync actions
  setSyncStatus: (status: SyncStatus) => void;
  
  // Analytics actions
  updateAnalytics: (analytics: Analytics) => void;
  
  // AI actions
  setAIAnalysis: (noteId: string, analysis: AIAnalysis) => void;
  
  // Search actions
  performSearch: (query: string) => void;
  clearSearch: () => void;
  
  // Import/Export actions
  importNotes: (notes: Note[]) => void;
  exportNotes: (noteIds: string[], format: string) => void;
  
  // User preferences
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Workspace actions
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  
  // Utility actions
  resetStore: () => void;
  getNoteById: (id: string) => Note | undefined;
  getNotesByCategory: (category: string) => Note[];
  getNotesByTag: (tag: string) => Note[];
  getRecentNotes: (limit?: number) => Note[];
  getArchivedNotes: () => Note[];
  getNoteStats: (noteId: string) => { wordCount: number; characterCount: number; readingTime: number };
}

const initialState = {
  notes: [],
  categories: [
    {
      id: '1',
      name: 'Général',
      color: '#3b82f6',
      icon: '📝',
      description: 'Notes générales',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Idées',
      color: '#f59e0b',
      icon: '💡',
      description: 'Idées et inspirations',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'TODO',
      color: '#10b981',
      icon: '✅',
      description: 'Tâches à faire',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Projets',
      color: '#8b5cf6',
      icon: '🚀',
      description: 'Gestion de projets',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      name: 'Urgent',
      color: '#ef4444',
      icon: '🚨',
      description: 'Notes urgentes',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  tags: [],
  currentUser: null,
  currentWorkspace: null,
  isDarkMode: true,
  sidebarExpanded: false,
  activeNoteId: null,
  selectedCategory: 'Général',
  searchTerm: '',
  searchResults: [],
  modals: {},
  toasts: [],
  notifications: [],
  loadingStates: {},
  syncStatus: {
    lastSync: new Date(),
    status: 'synced',
    pendingChanges: 0,
  },
  analytics: null,
  aiAnalysis: {},
};

export const useAppStore = create<AppState>()(
  immer(
    persist(
      (set, get) => ({
        ...initialState,

        setDarkMode: (isDark) =>
          set((state) => {
            state.isDarkMode = isDark;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarExpanded = !state.sidebarExpanded;
          }),

        setActiveNote: (noteId) =>
          set((state) => {
            state.activeNoteId = noteId;
          }),

        setSelectedCategory: (category) =>
          set((state) => {
            state.selectedCategory = category;
          }),

        setSearchTerm: (term) =>
          set((state) => {
            state.searchTerm = term;
          }),

        addNote: (noteData) =>
          set((state) => {
            const newNote: Note = {
              ...noteData,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              createdAt: new Date(),
              updatedAt: new Date(),
              wordCount: noteData.content.split(/\s+/).length,
              characterCount: noteData.content.length,
              readingTime: Math.ceil(noteData.content.split(/\s+/).length / 200),
            };
            state.notes.unshift(newNote);
            state.activeNoteId = newNote.id;
          }),

        updateNote: (id, updates) =>
          set((state) => {
            const noteIndex = state.notes.findIndex((note) => note.id === id);
            if (noteIndex !== -1) {
              state.notes[noteIndex] = {
                ...state.notes[noteIndex],
                ...updates,
                updatedAt: new Date(),
                wordCount: updates.content ? updates.content.split(/\s+/).length : state.notes[noteIndex].wordCount,
                characterCount: updates.content ? updates.content.length : state.notes[noteIndex].characterCount,
                readingTime: updates.content ? Math.ceil(updates.content.split(/\s+/).length / 200) : state.notes[noteIndex].readingTime,
              };
            }
          }),

        deleteNote: (id) =>
          set((state) => {
            state.notes = state.notes.filter((note) => note.id !== id);
            if (state.activeNoteId === id) {
              state.activeNoteId = state.notes.length > 0 ? state.notes[0].id : null;
            }
          }),

        duplicateNote: (id) =>
          set((state) => {
            const originalNote = state.notes.find((note) => note.id === id);
            if (originalNote) {
              const duplicatedNote: Note = {
                ...originalNote,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                title: `${originalNote.title} (Copie)`,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              state.notes.unshift(duplicatedNote);
              state.activeNoteId = duplicatedNote.id;
            }
          }),

        archiveNote: (id) =>
          set((state) => {
            const note = state.notes.find((note) => note.id === id);
            if (note) {
              note.isArchived = true;
            }
          }),

        restoreNote: (id) =>
          set((state) => {
            const note = state.notes.find((note) => note.id === id);
            if (note) {
              note.isArchived = false;
            }
          }),

        addCategory: (categoryData) =>
          set((state) => {
            const newCategory: Category = {
              ...categoryData,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            state.categories.push(newCategory);
          }),

        updateCategory: (id, updates) =>
          set((state) => {
            const categoryIndex = state.categories.findIndex((cat) => cat.id === id);
            if (categoryIndex !== -1) {
              state.categories[categoryIndex] = {
                ...state.categories[categoryIndex],
                ...updates,
                updatedAt: new Date(),
              };
            }
          }),

        deleteCategory: (id) =>
          set((state) => {
            state.categories = state.categories.filter((cat) => cat.id !== id);
          }),

        addTag: (tagData) =>
          set((state) => {
            const newTag: Tag = {
              ...tagData,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              usageCount: 0,
              createdAt: new Date(),
            };
            state.tags.push(newTag);
          }),

        updateTag: (id, updates) =>
          set((state) => {
            const tagIndex = state.tags.findIndex((tag) => tag.id === id);
            if (tagIndex !== -1) {
              state.tags[tagIndex] = {
                ...state.tags[tagIndex],
                ...updates,
              };
            }
          }),

        deleteTag: (id) =>
          set((state) => {
            state.tags = state.tags.filter((tag) => tag.id !== id);
          }),

        openModal: (type, data) =>
          set((state) => {
            state.modals[type] = {
              isOpen: true,
              type,
              data,
            };
          }),

        closeModal: (type) =>
          set((state) => {
            if (state.modals[type]) {
              state.modals[type].isOpen = false;
            }
          }),

        addToast: (toastData) =>
          set((state) => {
            const newToast: Toast = {
              ...toastData,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            };
            state.toasts.push(newToast);
          }),

        removeToast: (id) =>
          set((state) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== id);
          }),

        addNotification: (notificationData) =>
          set((state) => {
            const newNotification: Notification = {
              ...notificationData,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              createdAt: new Date(),
              read: false,
            };
            state.notifications.unshift(newNotification);
          }),

        markNotificationAsRead: (id) =>
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (notification) {
              notification.read = true;
            }
          }),

        removeNotification: (id) =>
          set((state) => {
            state.notifications = state.notifications.filter((n) => n.id !== id);
          }),

        setLoading: (key, loading) =>
          set((state) => {
            state.loadingStates[key] = loading;
          }),

        clearLoading: (key) =>
          set((state) => {
            delete state.loadingStates[key];
          }),

        setSyncStatus: (status) =>
          set((state) => {
            state.syncStatus = status;
          }),

        updateAnalytics: (analytics) =>
          set((state) => {
            state.analytics = analytics;
          }),

        setAIAnalysis: (noteId, analysis) =>
          set((state) => {
            state.aiAnalysis[noteId] = analysis;
          }),

        performSearch: (query) =>
          set((state) => {
            if (!query.trim()) {
              state.searchResults = [];
              return;
            }

            const results: SearchResult[] = state.notes
              .filter((note) => !note.isArchived)
              .map((note) => {
                const titleMatch = note.title.toLowerCase().includes(query.toLowerCase());
                const contentMatch = note.content.toLowerCase().includes(query.toLowerCase());
                const tagMatch = note.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
                const categoryMatch = note.category.toLowerCase().includes(query.toLowerCase());

                if (titleMatch || contentMatch || tagMatch || categoryMatch) {
                  const matchedFields: string[] = [];
                  if (titleMatch) matchedFields.push('title');
                  if (contentMatch) matchedFields.push('content');
                  if (tagMatch) matchedFields.push('tags');
                  if (categoryMatch) matchedFields.push('category');

                  const snippet = contentMatch
                    ? note.content.substring(0, 150) + '...'
                    : note.title;

                  return {
                    note,
                    relevance: (titleMatch ? 3 : 0) + (contentMatch ? 2 : 0) + (tagMatch ? 1 : 0) + (categoryMatch ? 1 : 0),
                    matchedFields,
                    snippet,
                  };
                }
                return null;
              })
              .filter((result): result is SearchResult => result !== null)
              .sort((a, b) => b.relevance - a.relevance);

            state.searchResults = results;
          }),

        clearSearch: () =>
          set((state) => {
            state.searchTerm = '';
            state.searchResults = [];
          }),

        importNotes: (notes) =>
          set((state) => {
            state.notes = [...notes, ...state.notes];
          }),

        exportNotes: (noteIds, format) => {
          const { notes } = get();
          const selectedNotes = notes.filter((note) => noteIds.includes(note.id));
          // Implementation will be in a separate utility
          console.log('Exporting notes:', selectedNotes, 'in format:', format);
        },

        updateUserPreferences: (preferences) =>
          set((state) => {
            if (state.currentUser) {
              state.currentUser.preferences = {
                ...state.currentUser.preferences,
                ...preferences,
              };
            }
          }),

        setCurrentWorkspace: (workspace) =>
          set((state) => {
            state.currentWorkspace = workspace;
          }),

        resetStore: () =>
          set(() => ({
            ...initialState,
          })),

        getNoteById: (id) => {
          const { notes } = get();
          return notes.find((note) => note.id === id);
        },

        getNotesByCategory: (category) => {
          const { notes } = get();
          return notes.filter((note) => note.category === category && !note.isArchived);
        },

        getNotesByTag: (tag) => {
          const { notes } = get();
          return notes.filter((note) => note.tags.includes(tag) && !note.isArchived);
        },

        getRecentNotes: (limit = 5) => {
          const { notes } = get();
          return notes
            .filter((note) => !note.isArchived)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, limit);
        },

        getArchivedNotes: () => {
          const { notes } = get();
          return notes.filter((note) => note.isArchived);
        },

        getNoteStats: (noteId) => {
          const { notes } = get();
          const note = notes.find((n) => n.id === noteId);
          if (!note) return { wordCount: 0, characterCount: 0, readingTime: 0 };

          return {
            wordCount: note.wordCount || note.content.split(/\s+/).length,
            characterCount: note.characterCount || note.content.length,
            readingTime: note.readingTime || Math.ceil(note.content.split(/\s+/).length / 200),
          };
        },
      }),
      {
        name: 'sid-hud-store',
        partialize: (state) => ({
          notes: state.notes,
          categories: state.categories,
          tags: state.tags,
          isDarkMode: state.isDarkMode,
          currentUser: state.currentUser,
          analytics: state.analytics,
        }),
      }
    )
  )
);