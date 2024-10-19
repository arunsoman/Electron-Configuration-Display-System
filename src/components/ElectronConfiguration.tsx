import React from 'react';
import { Element } from '../types';

interface ElectronConfigurationProps {
  element: Element;
  useNobleGasNotation: boolean;
  onToggleNotation: () => void;
}

const ElectronConfiguration: React.FC<ElectronConfigurationProps> = ({
  element,
  useNobleGasNotation,
  onToggleNotation,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{element.name} (#{element.atomicNumber})</h2>
      <p className="text-xl mb-4">
        {useNobleGasNotation ? element.nobleGasConfiguration : element.electronConfiguration}
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={onToggleNotation}
      >
        Toggle Notation
      </button>
    </div>
  );
};

export default ElectronConfiguration;