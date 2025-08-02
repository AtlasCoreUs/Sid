import React, { useState, useRef } from 'react';

interface ImageData {
  url: string;
  alt: string;
  caption?: string;
  id: string;
  size: number;
  type: string;
}

interface ImageUploaderProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  isDarkMode: boolean;
}

export function ImageUploader({ images, onImagesChange, isDarkMode }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.type.startsWith('image/')) {
        try {
          const imageData = await processImage(file);
          onImagesChange([...images, imageData]);
        } catch (error) {
          console.error('Erreur lors du traitement de l\'image:', error);
        }
      }
    }
    
    setUploading(false);
  };

  const processImage = (file: File): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Redimensionner l'image si elle est trop grande
          const maxWidth = 800;
          const maxHeight = 600;
          let { width, height } = img;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const imageData: ImageData = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                url,
                alt: file.name,
                caption: caption || file.name,
                size: blob.size,
                type: file.type
              };
              resolve(imageData);
            } else {
              reject(new Error('Erreur lors de la compression de l\'image'));
            }
          }, 'image/jpeg', 0.8);
        };
        
        img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId: string) => {
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    onImagesChange(images.filter(img => img.id !== imageId));
  };

  const updateImageCaption = (imageId: string, newCaption: string) => {
    onImagesChange(images.map(img => 
      img.id === imageId ? { ...img, caption: newCaption } : img
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="image-uploader">
      <div className="upload-header">
        <h3>📸 Gestionnaire d'Images</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="upload-btn"
          disabled={uploading}
        >
          {uploading ? '⏳ Upload...' : '📁 Choisir des images'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />

      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon">📸</div>
          <p>Glissez-déposez vos images ici</p>
          <p className="upload-hint">ou cliquez pour sélectionner</p>
          <div className="upload-formats">
            <span>Formats supportés: JPG, PNG, GIF, WebP</span>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="images-gallery">
          <h4>🖼️ Images ({images.length})</h4>
          <div className="images-grid">
            {images.map((image) => (
              <div key={image.id} className="image-item">
                <div className="image-container">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="gallery-image"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <button
                      onClick={() => removeImage(image.id)}
                      className="remove-image-btn"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                    <div className="image-info">
                      <span className="image-size">{formatFileSize(image.size)}</span>
                      <span className="image-type">{image.type}</span>
                    </div>
                  </div>
                </div>
                <div className="image-caption">
                  <input
                    type="text"
                    value={image.caption || ''}
                    onChange={(e) => updateImageCaption(image.id, e.target.value)}
                    placeholder="Légende de l'image..."
                    className="caption-input"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="upload-tips">
        <h4>💡 Conseils</h4>
        <ul>
          <li>Les images sont automatiquement redimensionnées pour optimiser les performances</li>
          <li>Format recommandé: JPG pour les photos, PNG pour les graphiques</li>
          <li>Taille maximale: 800x600 pixels</li>
          <li>Ajoutez des légendes pour une meilleure organisation</li>
        </ul>
      </div>
    </div>
  );
}