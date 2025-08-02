import React, { useState, useEffect } from 'react';

interface FileManagerProps {
  notes: Array<{
    id: string;
    title: string;
    category: string;
    updatedAt: Date;
    content: string;
  }>;
  onSelectNote: (noteId: string) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export function FileManager({ notes, onSelectNote, onClose, isDarkMode }: FileManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const categories = ['Toutes', ...Array.from(new Set(notes.map(note => note.category)))];
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'date':
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };
  
  const handleSelectNote = (noteId: string) => {
    onSelectNote(noteId);
    onClose();
  };
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return (
    <div className="file-manager-overlay" onClick={onClose}>
      <div className="file-manager" onClick={(e) => e.stopPropagation()}>
        <div className="file-manager-header">
          <h2>📁 Gestionnaire de Fichiers</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="file-manager-toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="file-manager-content">
          <table className="files-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Nom {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('category')} className="sortable">
                  Catégorie {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('date')} className="sortable">
                  Modifié {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Aperçu</th>
              </tr>
            </thead>
            <tbody>
              {sortedNotes.map(note => (
                <tr 
                  key={note.id} 
                  onClick={() => handleSelectNote(note.id)}
                  className="file-row"
                >
                  <td className="file-name">
                    <span className="file-icon">📄</span>
                    {note.title}
                  </td>
                  <td>
                    <span className={`category-badge category-${note.category.toLowerCase()}`}>
                      {note.category}
                    </span>
                  </td>
                  <td className="file-date">
                    {note.updatedAt.toLocaleDateString()} {note.updatedAt.toLocaleTimeString()}
                  </td>
                  <td className="file-preview">
                    {note.content.substring(0, 50)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedNotes.length === 0 && (
            <div className="no-files">
              <p>Aucun fichier trouvé</p>
            </div>
          )}
        </div>
        
        <div className="file-manager-footer">
          <span>{sortedNotes.length} fichier(s)</span>
          <div className="view-options">
            <button className="view-btn active" title="Vue tableau">⚏</button>
            <button className="view-btn" title="Vue grille">⚎</button>
            <button className="view-btn" title="Vue liste">☰</button>
          </div>
        </div>
      </div>
    </div>
  );
}