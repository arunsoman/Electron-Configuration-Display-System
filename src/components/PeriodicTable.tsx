import React, { useState, useEffect, useRef } from 'react';
import { Element } from '../types';
import elementData from '../data/elements.json';

interface PeriodicTableProps {
  onElementSelect: (element: Element) => void;
  selectedElement: Element | null;
}

// Define the layout of the periodic table grid with empty spaces for alignment
const periodicTableLayout: (string | null)[] = [
  "H", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "He",
  "Li", "Be", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "B", "C", "N", "O", "F", "Ne",
  "Na", "Mg", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "Al", "Si", "P", "S", "Cl", "Ar",
  "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr",
  "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe",
  "Cs", "Ba", "  ", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn",
  "Fr", "Ra", "  ", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og",
  "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ", "  ",
  "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu",
  "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"
];

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onElementSelect, selectedElement }) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]); // Store button refs for focus management

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rowSize = 18; // Number of columns in each row

    switch (event.key) {
      case 'ArrowUp':
        if (index - rowSize >= 0) {
          setFocusedIndex(index - rowSize);
        }
        break;
      case 'ArrowDown':
        if (index + rowSize < periodicTableLayout.length) {
          setFocusedIndex(index + rowSize);
        }
        break;
      case 'ArrowLeft':
        if (index % rowSize !== 0) {
          setFocusedIndex(index - 1);
        }
        break;
      case 'ArrowRight':
        if (index % rowSize !== rowSize - 1) {
          setFocusedIndex(index + 1);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (focusedIndex !== null && buttonRefs.current[focusedIndex]) {
      buttonRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const getElementBySymbol = (symbol: string | null) => {
    return elementData.find((el: Element) => el.symbol === symbol);
  };

  return (
    <div className="grid grid-cols-18 gap-1">
      {periodicTableLayout.map((symbol, index) => {
        const element = getElementBySymbol(symbol);

        if (symbol === '  ') {
          // Render an invisible placeholder to align elements
          return <div key={index} className="p-2 border-transparent visibility-hidden"></div>;
        }

        return (
          <button
            key={element?.atomicNumber}
            ref={(el) => (buttonRefs.current[index] = el)} // Store button reference for focus management
            tabIndex={index === focusedIndex ? 0 : -1} // Set focus only on the currently focused button
            className={`p-2 text-center border ${
              selectedElement?.atomicNumber === element?.atomicNumber
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => element && onElementSelect(element)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onMouseEnter={() => setFocusedIndex(index)} // Allow mouse hover to focus as well
            onFocus={() => element&& onElementSelect(element)}
          >
            <div className="text-xs">{element?.atomicNumber}</div>
            <div className="font-bold">{element?.symbol}</div>
            <div className="text-xs truncate">{element?.name}</div>
          </button>
        );
      })}
    </div>
  );
};

export default PeriodicTable;
