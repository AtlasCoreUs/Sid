import React, { useState, useEffect } from 'react';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

export function MarkdownEditor({ content, onChange, isDarkMode }: MarkdownEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSplitView, setIsSplitView] = useState(true);
  const [renderedContent, setRenderedContent] = useState('');
  
  // Fonction simple de rendu Markdown (sans bibliothèque externe)
  const renderMarkdown = (text: string): string => {
    let html = text;
    
    // Titres
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Gras et italique
    html = html.replace(/\*\*\*(.*)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*)\*/g, '<em>$1</em>');
    
    // Souligné et barré
    html = html.replace(/__(.*?)__/g, '<u>$1</u>');
    html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');
    
    // Listes à puces
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Listes numérotées
    html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
    
    // Liens
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
    
    // Code inline
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Blocs de code
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Citations
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');
    
    // Lignes horizontales
    html = html.replace(/^---$/gim, '<hr>');
    
    // Cases à cocher
    html = html.replace(/\[ \]/g, '<input type="checkbox" disabled>');
    html = html.replace(/\[x\]/gi, '<input type="checkbox" checked disabled>');
    
    // Paragraphes
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Nettoyage
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    
    return html;
  };
  
  useEffect(() => {
    setRenderedContent(renderMarkdown(content));
  }, [content]);
  
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('.markdown-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    onChange(newText);
    
    // Repositionner le curseur
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };
  
  const handleToolbarAction = (action: string) => {
    switch (action) {
      case 'bold':
        insertMarkdown('**', '**');
        break;
      case 'italic':
        insertMarkdown('*', '*');
        break;
      case 'heading1':
        insertMarkdown('# ', '');
        break;
      case 'heading2':
        insertMarkdown('## ', '');
        break;
      case 'heading3':
        insertMarkdown('### ', '');
        break;
      case 'link':
        insertMarkdown('[', '](url)');
        break;
      case 'image':
        insertMarkdown('![', '](url)');
        break;
      case 'code':
        insertMarkdown('`', '`');
        break;
      case 'codeblock':
        insertMarkdown('```\n', '\n```');
        break;
      case 'quote':
        insertMarkdown('> ', '');
        break;
      case 'list':
        insertMarkdown('- ', '');
        break;
      case 'orderedList':
        insertMarkdown('1. ', '');
        break;
      case 'checkbox':
        insertMarkdown('[ ] ', '');
        break;
      case 'hr':
        insertMarkdown('\n---\n', '');
        break;
    }
  };
  
  return (
    <div className="markdown-editor">
      <div className="markdown-toolbar">
        <div className="toolbar-group">
          <button onClick={() => handleToolbarAction('bold')} title="Gras">
            <strong>B</strong>
          </button>
          <button onClick={() => handleToolbarAction('italic')} title="Italique">
            <em>I</em>
          </button>
          <button onClick={() => handleToolbarAction('heading1')} title="Titre 1">
            H1
          </button>
          <button onClick={() => handleToolbarAction('heading2')} title="Titre 2">
            H2
          </button>
          <button onClick={() => handleToolbarAction('heading3')} title="Titre 3">
            H3
          </button>
        </div>
        
        <div className="toolbar-separator" />
        
        <div className="toolbar-group">
          <button onClick={() => handleToolbarAction('link')} title="Lien">
            🔗
          </button>
          <button onClick={() => handleToolbarAction('image')} title="Image">
            🖼️
          </button>
          <button onClick={() => handleToolbarAction('code')} title="Code">
            {'</>'}
          </button>
          <button onClick={() => handleToolbarAction('codeblock')} title="Bloc de code">
            {'<>'}
          </button>
        </div>
        
        <div className="toolbar-separator" />
        
        <div className="toolbar-group">
          <button onClick={() => handleToolbarAction('quote')} title="Citation">
            "
          </button>
          <button onClick={() => handleToolbarAction('list')} title="Liste">
            •
          </button>
          <button onClick={() => handleToolbarAction('orderedList')} title="Liste numérotée">
            1.
          </button>
          <button onClick={() => handleToolbarAction('checkbox')} title="Case à cocher">
            ☐
          </button>
          <button onClick={() => handleToolbarAction('hr')} title="Ligne horizontale">
            ―
          </button>
        </div>
        
        <div className="toolbar-separator" />
        
        <div className="toolbar-group view-controls">
          <button 
            onClick={() => { setIsPreviewMode(false); setIsSplitView(false); }}
            className={!isPreviewMode && !isSplitView ? 'active' : ''}
            title="Édition seule"
          >
            ✏️
          </button>
          <button 
            onClick={() => { setIsPreviewMode(false); setIsSplitView(true); }}
            className={!isPreviewMode && isSplitView ? 'active' : ''}
            title="Vue divisée"
          >
            ⚏
          </button>
          <button 
            onClick={() => { setIsPreviewMode(true); setIsSplitView(false); }}
            className={isPreviewMode ? 'active' : ''}
            title="Aperçu seul"
          >
            👁️
          </button>
        </div>
      </div>
      
      <div className={`markdown-content ${isSplitView ? 'split-view' : ''}`}>
        {!isPreviewMode && (
          <div className="markdown-editor-pane">
            <textarea
              className="markdown-editor-textarea"
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Écrivez en Markdown..."
              spellCheck="false"
            />
          </div>
        )}
        
        {(isPreviewMode || isSplitView) && (
          <div className="markdown-preview-pane">
            <div 
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
}