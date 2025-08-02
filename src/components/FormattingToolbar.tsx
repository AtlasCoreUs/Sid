import React, { useState } from 'react';

interface FormattingToolbarProps {
  onFormat: (format: string, value?: string) => void;
  isDarkMode: boolean;
}

export function FormattingToolbar({ onFormat, isDarkMode }: FormattingToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];
  
  const highlightColors = [
    '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'
  ];

  const handleFormat = (format: string, value?: string) => {
    onFormat(format, value);
    setShowColorPicker(false);
    setShowHighlightPicker(false);
  };

  return (
    <div className="formatting-toolbar">
      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('bold')}
          title="Gras (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('italic')}
          title="Italique (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('underline')}
          title="Souligné (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('strikethrough')}
          title="Barré"
        >
          <s>S</s>
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <div className="color-picker-wrapper">
          <button 
            className="toolbar-btn color-btn" 
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            title="Surligner"
          >
            🖍️
          </button>
          {showHighlightPicker && (
            <div className="color-picker-dropdown">
              {highlightColors.map(color => (
                <button
                  key={color}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                  onClick={() => handleFormat('highlight', color)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="color-picker-wrapper">
          <button 
            className="toolbar-btn color-btn" 
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Couleur du texte"
          >
            🎨
          </button>
          {showColorPicker && (
            <div className="color-picker-dropdown">
              {colors.map(color => (
                <button
                  key={color}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                  onClick={() => handleFormat('color', color)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('heading1')}
          title="Titre 1"
        >
          H1
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('heading2')}
          title="Titre 2"
        >
          H2
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('heading3')}
          title="Titre 3"
        >
          H3
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('bulletList')}
          title="Liste à puces"
        >
          • ―
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('numberList')}
          title="Liste numérotée"
        >
          1. ―
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('checkbox')}
          title="Case à cocher"
        >
          ☐
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('link')}
          title="Insérer un lien"
        >
          🔗
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('image')}
          title="Insérer une image"
        >
          🖼️
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('table')}
          title="Insérer un tableau"
        >
          📊
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('code')}
          title="Bloc de code"
        >
          {'</>'}
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('alignLeft')}
          title="Aligner à gauche"
        >
          ⬅
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('alignCenter')}
          title="Centrer"
        >
          ⬌
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => handleFormat('alignRight')}
          title="Aligner à droite"
        >
          ➡
        </button>
      </div>
    </div>
  );
}