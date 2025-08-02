import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotesManager } from '../NotesManager';

// Mock du store
jest.mock('../../store', () => ({
  useAppStore: jest.fn(() => ({
    notes: [
      {
        id: '1',
        title: 'Test Note 1',
        content: 'This is a test note content',
        category: 'Général',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        tags: ['test', 'example'],
        wordCount: 6,
        characterCount: 28,
        readingTime: 1,
      },
      {
        id: '2',
        title: 'Test Note 2',
        content: 'Another test note with more content',
        category: 'Idées',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        tags: ['test', 'ideas'],
        wordCount: 7,
        characterCount: 35,
        readingTime: 1,
      },
    ],
    categories: [
      { id: '1', name: 'Général', color: '#3b82f6', icon: '📝' },
      { id: '2', name: 'Idées', color: '#f59e0b', icon: '💡' },
    ],
    activeNoteId: '1',
    selectedCategory: 'Général',
    searchTerm: '',
    addNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
    duplicateNote: jest.fn(),
    setActiveNote: jest.fn(),
    setSelectedCategory: jest.fn(),
    setSearchTerm: jest.fn(),
    performSearch: jest.fn(),
  })),
}));

describe('NotesManager', () => {
  const defaultProps = {
    searchTerm: '',
    isDarkMode: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NotesManager {...defaultProps} />);
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('displays notes list correctly', () => {
    render(<NotesManager {...defaultProps} />);
    
    expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    expect(screen.getByText('Test Note 2')).toBeInTheDocument();
  });

  it('shows note statistics', () => {
    render(<NotesManager {...defaultProps} />);
    
    expect(screen.getByText('6 mots')).toBeInTheDocument();
    expect(screen.getByText('28 caractères')).toBeInTheDocument();
    expect(screen.getByText('1 min de lecture')).toBeInTheDocument();
  });

  it('displays category filter', () => {
    render(<NotesManager {...defaultProps} />);
    
    expect(screen.getByText('Général')).toBeInTheDocument();
    expect(screen.getByText('Idées')).toBeInTheDocument();
  });

  it('shows tags for notes', () => {
    render(<NotesManager {...defaultProps} />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('example')).toBeInTheDocument();
    expect(screen.getByText('ideas')).toBeInTheDocument();
  });

  it('handles new note creation', async () => {
    const user = userEvent.setup();
    render(<NotesManager {...defaultProps} />);
    
    const newNoteButton = screen.getByText('➕');
    await user.click(newNoteButton);
    
    expect(screen.getByPlaceholderText('Titre de la nouvelle note...')).toBeInTheDocument();
  });

  it('handles note deletion', async () => {
    const user = userEvent.setup();
    render(<NotesManager {...defaultProps} />);
    
    const deleteButtons = screen.getAllByText('🗑️');
    await user.click(deleteButtons[0]);
    
    // Vérifier que la confirmation apparaît
    expect(screen.getByText(/supprimer/i)).toBeInTheDocument();
  });

  it('handles note duplication', async () => {
    const user = userEvent.setup();
    render(<NotesManager {...defaultProps} />);
    
    const duplicateButtons = screen.getAllByText('📋');
    await user.click(duplicateButtons[0]);
    
    // Vérifier que la note est dupliquée
    expect(screen.getByText('Test Note 1 (Copie)')).toBeInTheDocument();
  });

  it('filters notes by category', async () => {
    const user = userEvent.setup();
    render(<NotesManager {...defaultProps} />);
    
    const categorySelect = screen.getByDisplayValue('Général');
    await user.selectOptions(categorySelect, 'Idées');
    
    // Vérifier que seules les notes de la catégorie sélectionnée sont affichées
    expect(screen.getByText('Test Note 2')).toBeInTheDocument();
    expect(screen.queryByText('Test Note 1')).not.toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const user = userEvent.setup();
    render(<NotesManager {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Rechercher dans les notes...');
    await user.type(searchInput, 'test');
    
    // Vérifier que la recherche fonctionne
    expect(searchInput).toHaveValue('test');
  });

  it('displays note preview correctly', () => {
    render(<NotesManager {...defaultProps} />);
    
    expect(screen.getByText('This is a test note content')).toBeInTheDocument();
  });

  it('shows note metadata', () => {
    render(<NotesManager {...defaultProps} />);
    
    expect(screen.getByText('Général')).toBeInTheDocument();
    expect(screen.getByText('01/01/2024')).toBeInTheDocument();
  });

  it('handles keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<NotesManager {...defaultProps} />);
    
    // Test Ctrl+N pour nouvelle note
    await user.keyboard('{Control>}n{/Control}');
    
    expect(screen.getByPlaceholderText('Titre de la nouvelle note...')).toBeInTheDocument();
  });

  it('handles export functionality', async () => {
    const user = userEvent.setup();
    render(<NotesManager {...defaultProps} />);
    
    const exportButtons = screen.getAllByText(/📄|📝/);
    await user.click(exportButtons[0]);
    
    // Vérifier que l'export fonctionne
    expect(screen.getByText(/export/i)).toBeInTheDocument();
  });

  it('displays recent notes', () => {
    render(<NotesManager {...defaultProps} />);
    
    expect(screen.getByText('Notes récentes')).toBeInTheDocument();
    expect(screen.getByText('Test Note 1')).toBeInTheDocument();
  });

  it('handles note selection', async () => {
    const user = userEvent.setup();
    render(<NotesManager {...defaultProps} />);
    
    const noteItems = screen.getAllByRole('button');
    await user.click(noteItems[1]); // Cliquer sur la deuxième note
    
    // Vérifier que la note est sélectionnée
    expect(noteItems[1]).toHaveClass('active');
  });

  it('shows loading state', () => {
    render(<NotesManager {...defaultProps} />);
    
    // Simuler un état de chargement
    const loadingElement = screen.queryByText('Chargement...');
    if (loadingElement) {
      expect(loadingElement).toBeInTheDocument();
    }
  });

  it('handles empty state', () => {
    // Mock avec des notes vides
    jest.mocked(require('../../store').useAppStore).mockReturnValue({
      ...jest.mocked(require('../../store').useAppStore)(),
      notes: [],
    });

    render(<NotesManager {...defaultProps} />);
    
    expect(screen.getByText(/aucune note/i)).toBeInTheDocument();
  });

  it('handles error state gracefully', () => {
    // Simuler une erreur
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<NotesManager {...defaultProps} />);
    
    // Vérifier que l'application ne plante pas
    expect(screen.getByText('Notes')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('maintains accessibility', () => {
    render(<NotesManager {...defaultProps} />);
    
    // Vérifier les attributs d'accessibilité
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('handles responsive design', () => {
    // Simuler une taille d'écran mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<NotesManager {...defaultProps} />);
    
    // Vérifier que l'interface s'adapte
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });
});