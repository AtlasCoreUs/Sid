import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import type { Note, NoteLink } from '../types';

interface KnowledgeGraphProps {
  isVisible: boolean;
  onClose: () => void;
}

interface GraphNode {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  size: number;
  color: string;
  connections: string[];
}

interface GraphConnection {
  source: string;
  target: string;
  strength: number;
  type: 'bidirectional' | 'unidirectional';
}

export function KnowledgeGraph({ isVisible, onClose }: KnowledgeGraphProps): JSX.Element | null {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [connections, setConnections] = useState<GraphConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [graphMode, setGraphMode] = useState<'force' | 'hierarchical' | 'circular'>('force');
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filters, setFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { notes, categories } = useAppStore();

  useEffect(() => {
    if (isVisible && notes.length > 0) {
      generateGraph();
    }
  }, [isVisible, notes]);

  const generateGraph = (): void => {
    const graphNodes: GraphNode[] = [];
    const graphConnections: GraphConnection[] = [];

    // Créer les nœuds pour chaque note
    notes.forEach((note, index) => {
      const category = categories.find(cat => cat.name === note.category);
      const angle = (index / notes.length) * 2 * Math.PI;
      const radius = 200;
      
      const node: GraphNode = {
        id: note.id,
        label: note.title,
        category: note.category,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: Math.max(20, Math.min(50, note.content.length / 10)),
        color: category?.color || '#3b82f6',
        connections: [],
      };
      
      graphNodes.push(node);
    });

    // Créer les connexions basées sur les liens et similarités
    notes.forEach((note, index) => {
      // Liens explicites
      if (note.links) {
        note.links.forEach(link => {
          graphConnections.push({
            source: note.id,
            target: link.targetNoteId,
            strength: 1,
            type: link.linkType,
          });
        });
      }

      // Connexions basées sur les tags
      notes.slice(index + 1).forEach(otherNote => {
        const commonTags = note.tags.filter(tag => otherNote.tags.includes(tag));
        if (commonTags.length > 0) {
          graphConnections.push({
            source: note.id,
            target: otherNote.id,
            strength: commonTags.length * 0.5,
            type: 'bidirectional',
          });
        }
      });

      // Connexions basées sur la catégorie
      notes.slice(index + 1).forEach(otherNote => {
        if (note.category === otherNote.category) {
          graphConnections.push({
            source: note.id,
            target: otherNote.id,
            strength: 0.3,
            type: 'bidirectional',
          });
        }
      });
    });

    setNodes(graphNodes);
    setConnections(graphConnections);
  };

  const renderGraph = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.scale(zoom, zoom);

    // Dessiner les connexions
    connections.forEach(connection => {
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);
      
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${connection.strength})`;
        ctx.lineWidth = connection.strength * 3;
        ctx.stroke();

        // Flèche pour les connexions unidirectionnelles
        if (connection.type === 'unidirectional') {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const angle = Math.atan2(dy, dx);
          
          ctx.save();
          ctx.translate(targetNode.x, targetNode.y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(-10, -5);
          ctx.lineTo(0, 0);
          ctx.lineTo(-10, 5);
          ctx.stroke();
          ctx.restore();
        }
      }
    });

    // Dessiner les nœuds
    nodes.forEach(node => {
      if (filters.length > 0 && !filters.includes(node.category)) return;
      
      const isSelected = selectedNode === node.id;
      const isHighlighted = searchTerm && node.label.toLowerCase().includes(searchTerm.toLowerCase());

      // Cercle du nœud
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? '#ef4444' : isHighlighted ? '#f59e0b' : node.color;
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : '#ffffff';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.stroke();

      // Texte du nœud
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Montserrat';
      ctx.textAlign = 'center';
      ctx.fillText(node.label.substring(0, 15), node.x, node.y + node.size + 15);
    });

    ctx.restore();
  };

  useEffect(() => {
    if (isVisible) {
      renderGraph();
    }
  }, [isVisible, nodes, connections, selectedNode, zoom, center, filters, searchTerm]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - center.x) / zoom;
    const y = (event.clientY - rect.top - center.y) / zoom;

    // Vérifier si un nœud a été cliqué
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return distance <= node.size;
    });

    setSelectedNode(clickedNode?.id || null);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (isDragging) {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      setCenter(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>): void => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(3, prev * delta)));
  };

  const applyForceLayout = (): void => {
    // Simulation de force pour repositionner les nœuds
    const iterations = 100;
    const repulsion = 100;
    const attraction = 0.1;

    for (let i = 0; i < iterations; i++) {
      const newNodes = [...nodes];

      // Forces de répulsion entre tous les nœuds
      newNodes.forEach((node, index) => {
        let fx = 0;
        let fy = 0;

        newNodes.forEach((otherNode, otherIndex) => {
          if (index !== otherIndex) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              const force = repulsion / (distance * distance);
              fx += (dx / distance) * force;
              fy += (dy / distance) * force;
            }
          }
        });

        // Forces d'attraction pour les connexions
        connections.forEach(connection => {
          if (connection.source === node.id) {
            const targetNode = newNodes.find(n => n.id === connection.target);
            if (targetNode) {
              const dx = targetNode.x - node.x;
              const dy = targetNode.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > 0) {
                const force = distance * attraction * connection.strength;
                fx += (dx / distance) * force;
                fy += (dy / distance) * force;
              }
            }
          }
        });

        // Appliquer les forces
        node.x += fx * 0.1;
        node.y += fy * 0.1;
      });
    }

    setNodes(newNodes);
  };

  const resetView = (): void => {
    setZoom(1);
    setCenter({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const toggleFilter = (category: string): void => {
    setFilters(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="knowledge-graph"
      >
        <div className="graph-header">
          <h3>🧠 Graphe de Connaissances</h3>
          <button onClick={onClose} className="graph-close-btn">×</button>
        </div>

        <div className="graph-controls">
          <div className="control-group">
            <label>Mode:</label>
            <select value={graphMode} onChange={(e) => setGraphMode(e.target.value as any)}>
              <option value="force">Force</option>
              <option value="hierarchical">Hiérarchique</option>
              <option value="circular">Circulaire</option>
            </select>
          </div>

          <div className="control-group">
            <button onClick={applyForceLayout} className="control-btn">
              🔄 Réorganiser
            </button>
            <button onClick={resetView} className="control-btn">
              🏠 Reset
            </button>
          </div>

          <div className="control-group">
            <input
              type="text"
              placeholder="Rechercher un nœud..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="graph-filters">
          <span>Filtres:</span>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => toggleFilter(category.name)}
              className={`filter-btn ${filters.includes(category.name) ? 'active' : ''}`}
              style={{ backgroundColor: category.color }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        <div className="graph-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className="graph-canvas"
          />
        </div>

        {selectedNode && (
          <div className="node-details">
            <h4>Détails du nœud</h4>
            <div className="node-info">
              <p><strong>ID:</strong> {selectedNode}</p>
              <p><strong>Connexions:</strong> {connections.filter(c => c.source === selectedNode || c.target === selectedNode).length}</p>
              <p><strong>Catégorie:</strong> {nodes.find(n => n.id === selectedNode)?.category}</p>
            </div>
          </div>
        )}

        <div className="graph-stats">
          <div className="stat-item">
            <span className="stat-value">{nodes.length}</span>
            <span className="stat-label">Nœuds</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{connections.length}</span>
            <span className="stat-label">Connexions</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{categories.length}</span>
            <span className="stat-label">Catégories</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}