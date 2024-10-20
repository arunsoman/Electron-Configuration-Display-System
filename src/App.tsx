import React, { useState } from 'react';
import PeriodicTable from './components/PeriodicTable';
import ElectronConfiguration from './components/ElectronConfiguration';
import OrbitalVisualization from './components/OrbitalVisualization';
import EnergyLevelVisualization from './components/EnergyLevelVisualization';
import CombinedVisualization from './components/CombinedVisualization';
import SearchBar from './components/SearchBar';
import { Element } from './types';

function App() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [useNobleGasNotation, setUseNobleGasNotation] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Electron Configuration Display System</h1>
      <SearchBar onElementSelect={setSelectedElement} />
      <div className="flex flex-wrap justify-center gap-8 mt-8">
        <div className="w-full lg:w-2/3">
          <PeriodicTable onElementSelect={setSelectedElement} selectedElement={selectedElement} />
        </div>
        <div className="grid grid-cols-4 gap-1">
          {selectedElement && (
            <>
              <ElectronConfiguration
                element={selectedElement}
                useNobleGasNotation={useNobleGasNotation}
                onToggleNotation={() => setUseNobleGasNotation(!useNobleGasNotation)}
              />
              <OrbitalVisualization element={selectedElement} />
              <EnergyLevelVisualization  element={selectedElement} />
              <CombinedVisualization  element={selectedElement} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;