import React, { useState, useRef } from 'react';

interface ImportExportProps {
  notes: any[];
  onImport: (notes: any[]) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export function ImportExport({ notes, onImport, onClose, isDarkMode }: ImportExportProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = (format: 'json' | 'txt' | 'md') => {
    let content = '';
    let filename = `notes-export-${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(notes, null, 2);
        filename += '.json';
        break;
        
      case 'txt':
        content = notes.map(note => 
          `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}\n\nCatégorie: ${note.category}\nTags: ${note.tags.join(', ')}\nCréé le: ${new Date(note.createdAt).toLocaleDateString()}\nModifié le: ${new Date(note.updatedAt).toLocaleDateString()}\n\n${'─'.repeat(50)}\n`
        ).join('\n');
        filename += '.txt';
        break;
        
      case 'md':
        content = notes.map(note => 
          `# ${note.title}\n\n${note.content}\n\n---\n\n**Catégorie:** ${note.category}  \n**Tags:** ${note.tags.join(', ')}  \n**Créé le:** ${new Date(note.createdAt).toLocaleDateString()}  \n**Modifié le:** ${new Date(note.updatedAt).toLocaleDateString()}\n\n---\n`
        ).join('\n');
        filename += '.md';
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.json')) {
          const importedNotes = JSON.parse(content);
          if (Array.isArray(importedNotes)) {
            // Convertir les dates string en objets Date
            const processedNotes = importedNotes.map(note => ({
              ...note,
              createdAt: new Date(note.createdAt),
              updatedAt: new Date(note.updatedAt),
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9) // Générer de nouveaux IDs
            }));
            onImport(processedNotes);
            alert(`${processedNotes.length} notes importées avec succès !`);
          } else {
            alert('Format de fichier invalide');
          }
        } else {
          alert('Seuls les fichiers JSON sont supportés pour l\'import');
        }
      } catch (error) {
        alert('Erreur lors de l\'import du fichier');
        console.error(error);
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.name.endsWith('.json'));
    
    if (jsonFile) {
      handleImport(jsonFile);
    } else {
      alert('Veuillez déposer un fichier JSON');
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };
  
  return (
    <div className="file-manager-overlay" onClick={onClose}>
      <div className="import-export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📤 Import / Export</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <div className="export-section">
            <h3>Exporter vos notes</h3>
            <p>Choisissez le format d'export :</p>
            
            <div className="export-buttons">
              <button 
                className="export-btn-large"
                onClick={() => handleExport('json')}
              >
                <span className="export-icon">📋</span>
                <span className="export-label">JSON</span>
                <span className="export-desc">Format complet avec toutes les données</span>
              </button>
              
              <button 
                className="export-btn-large"
                onClick={() => handleExport('txt')}
              >
                <span className="export-icon">📄</span>
                <span className="export-label">TXT</span>
                <span className="export-desc">Format texte simple</span>
              </button>
              
              <button 
                className="export-btn-large"
                onClick={() => handleExport('md')}
              >
                <span className="export-icon">📝</span>
                <span className="export-label">Markdown</span>
                <span className="export-desc">Format Markdown avec mise en forme</span>
              </button>
            </div>
          </div>
          
          <div className="import-section">
            <h3>Importer des notes</h3>
            <p>Importez des notes depuis un fichier JSON :</p>
            
            <div 
              className={`import-zone ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <span className="import-icon">📥</span>
              <p>Glissez-déposez un fichier JSON ici</p>
              <p className="import-or">ou</p>
              <button 
                className="import-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Choisir un fichier
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <p className="info-text">
            💡 Astuce : L'export JSON conserve toutes les métadonnées (tags, priorités, etc.)
          </p>
        </div>
      </div>
    </div>
  );
}