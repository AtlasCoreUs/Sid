import React, { useState, useRef, useEffect } from 'react';

interface TableEditorProps {
  initialData?: string[][];
  onUpdate: (data: string[][]) => void;
  isDarkMode: boolean;
}

export function TableEditor({ initialData, onUpdate, isDarkMode }: TableEditorProps) {
  const [rows, setRows] = useState(initialData?.length || 3);
  const [cols, setCols] = useState(initialData?.[0]?.length || 3);
  const [data, setData] = useState<string[][]>(() => {
    if (initialData) return initialData;
    return Array(3).fill(null).map(() => Array(3).fill(''));
  });
  const [colWidths, setColWidths] = useState<number[]>(() => Array(cols).fill(150));
  const [isResizing, setIsResizing] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onUpdate(data);
  }, [data]);

  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = [...data];
    newData[row][col] = value;
    setData(newData);
  };

  const addRow = () => {
    const newData = [...data, Array(cols).fill('')];
    setData(newData);
    setRows(rows + 1);
  };

  const addColumn = () => {
    const newData = data.map(row => [...row, '']);
    setData(newData);
    setCols(cols + 1);
    setColWidths([...colWidths, 150]);
  };

  const deleteRow = (index: number) => {
    if (rows > 1) {
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      setRows(rows - 1);
    }
  };

  const deleteColumn = (index: number) => {
    if (cols > 1) {
      const newData = data.map(row => row.filter((_, i) => i !== index));
      setData(newData);
      setCols(cols - 1);
      setColWidths(colWidths.filter((_, i) => i !== index));
    }
  };

  const handleMouseDown = (index: number) => {
    setIsResizing(index);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing !== null && tableRef.current) {
      const tableRect = tableRef.current.getBoundingClientRect();
      const newWidth = e.clientX - tableRect.left - colWidths.slice(0, isResizing).reduce((a, b) => a + b, 0);
      if (newWidth > 50) {
        const newWidths = [...colWidths];
        newWidths[isResizing] = newWidth;
        setColWidths(newWidths);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(null);
  };

  useEffect(() => {
    if (isResizing !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div className="table-editor">
      <div className="table-controls">
        <button onClick={addRow} className="table-btn" title="Ajouter une ligne">
          ➕ Ligne
        </button>
        <button onClick={addColumn} className="table-btn" title="Ajouter une colonne">
          ➕ Colonne
        </button>
        <span className="table-info">{rows}x{cols}</span>
      </div>
      
      <div className="table-wrapper" ref={tableRef}>
        <table className="editable-table">
          <thead>
            <tr>
              <th className="row-header"></th>
              {Array(cols).fill(null).map((_, colIndex) => (
                <th key={colIndex} style={{ width: colWidths[colIndex] }}>
                  <div className="col-header">
                    <span>{String.fromCharCode(65 + colIndex)}</span>
                    <button 
                      className="delete-col-btn"
                      onClick={() => deleteColumn(colIndex)}
                      title="Supprimer la colonne"
                    >
                      ✕
                    </button>
                  </div>
                  <div 
                    className="resize-handle"
                    onMouseDown={() => handleMouseDown(colIndex)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="row-header">
                  <div className="row-header-content">
                    <span>{rowIndex + 1}</span>
                    <button 
                      className="delete-row-btn"
                      onClick={() => deleteRow(rowIndex)}
                      title="Supprimer la ligne"
                    >
                      ✕
                    </button>
                  </div>
                </td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} style={{ width: colWidths[colIndex] }}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="cell-input"
                      placeholder={`${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}