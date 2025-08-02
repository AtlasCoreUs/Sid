import React, { useState } from 'react';

interface CategoryManagerProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
  isDarkMode: boolean;
}

export function CategoryManager({ categories, onAddCategory, onRemoveCategory, isDarkMode }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const defaultCategories = ['Général', 'Idées', 'TODO', 'Projets', 'Urgent'];
  const customCategories = categories.filter(cat => !defaultCategories.includes(cat));
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setShowForm(false);
    }
  };
  
  return (
    <div className="category-manager">
      <h3>🗂️ Gestion des catégories</h3>
      
      <div className="categories-list">
        <h4>Catégories par défaut</h4>
        <div className="category-items">
          {defaultCategories.map(cat => (
            <div key={cat} className="category-item default">
              <span className={`category-badge category-${cat.toLowerCase()}`}>
                {cat}
              </span>
              <span className="category-lock">🔒</span>
            </div>
          ))}
        </div>
        
        {customCategories.length > 0 && (
          <>
            <h4>Catégories personnalisées</h4>
            <div className="category-items">
              {customCategories.map(cat => (
                <div key={cat} className="category-item custom">
                  <span className="category-badge">{cat}</span>
                  <button
                    className="remove-category-btn"
                    onClick={() => onRemoveCategory(cat)}
                    title="Supprimer cette catégorie"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {showForm ? (
        <div className="new-category-form">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nom de la catégorie..."
            className="category-input"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddCategory();
              if (e.key === 'Escape') {
                setShowForm(false);
                setNewCategory('');
              }
            }}
          />
          <button onClick={handleAddCategory} className="btn-create">✓</button>
          <button onClick={() => {
            setShowForm(false);
            setNewCategory('');
          }} className="btn-cancel">✗</button>
        </div>
      ) : (
        <button
          className="add-category-btn"
          onClick={() => setShowForm(true)}
        >
          ➕ Ajouter une catégorie
        </button>
      )}
    </div>
  );
}