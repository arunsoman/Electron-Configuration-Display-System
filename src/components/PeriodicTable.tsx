import React from 'react';
import { Element } from '../types';
import elementData from '../data/elements.json';

interface PeriodicTableProps {
  onElementSelect: (element: Element) => void;
  selectedElement: Element | null;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onElementSelect, selectedElement }) => {
  return (
    <div className="grid grid-cols-18 gap-1">
      {elementData.map((element: Element) => (
        <button
          key={element.atomicNumber}
          className={`p-2 text-center border ${
            selectedElement?.atomicNumber === element.atomicNumber
              ? 'bg-blue-500 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
          onClick={() => onElementSelect(element)}
        >
          <div className="text-xs">{element.atomicNumber}</div>
          <div className="font-bold">{element.symbol}</div>
          <div className="text-xs truncate">{element.name}</div>
        </button>
      ))}
    </div>
  );
};

export default PeriodicTable;