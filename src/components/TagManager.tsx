import React, { useState, KeyboardEvent } from 'react';

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  isDarkMode: boolean;
}

export function TagManager({ tags, onTagsChange, isDarkMode }: TagManagerProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Prédéfini quelques suggestions de tags
  const commonTags = [
    'important', 'urgent', 'idée', 'projet', 'personnel', 'travail',
    'référence', 'todo', 'en-cours', 'terminé', 'révision', 'documentation'
  ];
  
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value) {
      const filtered = commonTags.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase()) && 
        !tags.includes(tag)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue('');
      setSuggestions([]);
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };
  
  const getTagColor = (tag: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#48DBFB', '#1DD1A1', '#F368E0'
    ];
    
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  return (
    <div className="tag-manager">
      <div className="tag-input-container">
        <div className="tags-wrapper">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="tag"
              style={{ backgroundColor: getTagColor(tag) }}
            >
              {tag}
              <button 
                className="tag-remove"
                onClick={() => removeTag(tag)}
                title="Supprimer le tag"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "Ajouter des tags..." : ""}
            className="tag-input"
          />
        </div>
        
        {suggestions.length > 0 && (
          <div className="tag-suggestions">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                className="tag-suggestion"
                onClick={() => addTag(suggestion)}
              >
                + {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="tag-info">
        <span className="tag-count">{tags.length} tag{tags.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}