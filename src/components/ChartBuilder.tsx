import React, { useState, useEffect } from 'react';

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  options?: any;
}

interface ChartBuilderProps {
  chartData: ChartData;
  onChartDataChange: (chartData: ChartData) => void;
  isDarkMode: boolean;
}

export function ChartBuilder({ chartData, onChartDataChange, isDarkMode }: ChartBuilderProps) {
  const [chartType, setChartType] = useState(chartData.type);
  const [labels, setLabels] = useState(chartData.data.labels.join(', '));
  const [datasets, setDatasets] = useState(chartData.data.datasets);
  const [newDatasetLabel, setNewDatasetLabel] = useState('');
  const [newDatasetData, setNewDatasetData] = useState('');

  const chartTypes = [
    { value: 'bar', label: '📊 Barres', icon: '📊' },
    { value: 'line', label: '📈 Ligne', icon: '📈' },
    { value: 'pie', label: '🥧 Secteurs', icon: '🥧' },
    { value: 'doughnut', label: '🍩 Anneau', icon: '🍩' },
    { value: 'radar', label: '🕷️ Radar', icon: '🕷️' }
  ];

  const colorPalettes = [
    ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
    ['#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'],
    ['#14b8a6', '#f43f5e', '#eab308', '#a855f7', '#06b6d4']
  ];

  useEffect(() => {
    const updatedChartData: ChartData = {
      type: chartType,
      data: {
        labels: labels.split(',').map(l => l.trim()).filter(l => l),
        datasets: datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: colorPalettes[index % colorPalettes.length],
          borderColor: isDarkMode ? '#ffffff' : '#000000',
          borderWidth: 2
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              color: isDarkMode ? '#ffffff' : '#000000'
            }
          },
          title: {
            display: true,
            text: 'Graphique interactif',
            color: isDarkMode ? '#ffffff' : '#000000'
          }
        },
        scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
          x: {
            ticks: { color: isDarkMode ? '#ffffff' : '#000000' },
            grid: { color: isDarkMode ? '#374151' : '#e5e7eb' }
          },
          y: {
            ticks: { color: isDarkMode ? '#ffffff' : '#000000' },
            grid: { color: isDarkMode ? '#374151' : '#e5e7eb' }
          }
        } : undefined
      }
    };

    onChartDataChange(updatedChartData);
  }, [chartType, labels, datasets, isDarkMode]);

  const addDataset = () => {
    if (!newDatasetLabel.trim() || !newDatasetData.trim()) return;

    const dataValues = newDatasetData.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    
    setDatasets(prev => [...prev, {
      label: newDatasetLabel,
      data: dataValues,
      backgroundColor: colorPalettes[datasets.length % colorPalettes.length],
      borderColor: isDarkMode ? '#ffffff' : '#000000',
      borderWidth: 2
    }]);

    setNewDatasetLabel('');
    setNewDatasetData('');
  };

  const removeDataset = (index: number) => {
    setDatasets(prev => prev.filter((_, i) => i !== index));
  };

  const updateDatasetData = (index: number, data: string) => {
    const dataValues = data.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    setDatasets(prev => prev.map((dataset, i) => 
      i === index ? { ...dataset, data: dataValues } : dataset
    ));
  };

  return (
    <div className="chart-builder">
      <div className="chart-builder-header">
        <h3>📊 Constructeur de Graphique</h3>
        <div className="chart-type-selector">
          {chartTypes.map(type => (
            <button
              key={type.value}
              className={`chart-type-btn ${chartType === type.value ? 'active' : ''}`}
              onClick={() => setChartType(type.value as any)}
              title={type.label}
            >
              {type.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-config">
        <div className="config-section">
          <label>📝 Labels (séparés par des virgules)</label>
          <input
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder="Jan, Fév, Mar, Avr, Mai, Jun"
            className="chart-input"
          />
        </div>

        <div className="config-section">
          <label>📊 Datasets</label>
          <div className="datasets-list">
            {datasets.map((dataset, index) => (
              <div key={index} className="dataset-item">
                <div className="dataset-header">
                  <input
                    type="text"
                    value={dataset.label}
                    onChange={(e) => setDatasets(prev => prev.map((d, i) => 
                      i === index ? { ...d, label: e.target.value } : d
                    ))}
                    className="dataset-label-input"
                    placeholder="Nom du dataset"
                  />
                  <button
                    onClick={() => removeDataset(index)}
                    className="remove-dataset-btn"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
                <input
                  type="text"
                  value={dataset.data.join(', ')}
                  onChange={(e) => updateDatasetData(index, e.target.value)}
                  className="dataset-data-input"
                  placeholder="10, 20, 30, 40, 50"
                />
              </div>
            ))}
          </div>

          <div className="add-dataset-form">
            <input
              type="text"
              value={newDatasetLabel}
              onChange={(e) => setNewDatasetLabel(e.target.value)}
              placeholder="Nom du nouveau dataset"
              className="new-dataset-input"
            />
            <input
              type="text"
              value={newDatasetData}
              onChange={(e) => setNewDatasetData(e.target.value)}
              placeholder="Données (séparées par des virgules)"
              className="new-dataset-input"
            />
            <button onClick={addDataset} className="add-dataset-btn">
              ➕ Ajouter
            </button>
          </div>
        </div>
      </div>

      <div className="chart-preview">
        <h4>👁️ Aperçu</h4>
        <div className="chart-container">
          {/* Ici on pourrait intégrer Chart.js ou Recharts pour l'aperçu en temps réel */}
          <div className="chart-placeholder">
            <div className="chart-mock">
              <div className="mock-chart">
                {chartType === 'bar' && (
                  <div className="mock-bars">
                    {chartData.data.labels.slice(0, 5).map((_, i) => (
                      <div key={i} className="mock-bar" style={{ height: `${20 + Math.random() * 60}%` }}></div>
                    ))}
                  </div>
                )}
                {chartType === 'line' && (
                  <div className="mock-line">
                    <svg width="200" height="100">
                      <path d="M0,80 L40,60 L80,40 L120,20 L160,10" stroke="currentColor" fill="none" strokeWidth="2"/>
                    </svg>
                  </div>
                )}
                {chartType === 'pie' && (
                  <div className="mock-pie">
                    <div className="pie-slice" style={{ transform: 'rotate(0deg)' }}></div>
                    <div className="pie-slice" style={{ transform: 'rotate(90deg)' }}></div>
                    <div className="pie-slice" style={{ transform: 'rotate(180deg)' }}></div>
                  </div>
                )}
              </div>
              <div className="mock-labels">
                {chartData.data.labels.slice(0, 3).map((label, i) => (
                  <span key={i} className="mock-label">{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}