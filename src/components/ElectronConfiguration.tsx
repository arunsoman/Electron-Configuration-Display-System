import React from 'react';
import { Element } from '../types';

// Utility function to calculate valence electrons and orbital type
const getValenceElectrons = (electronConfiguration: string) => {
  // Split the configuration by space to get the different energy levels and sublevels
  const sublevels = electronConfiguration.split(' ');

  // Find the highest energy level by parsing each sublevel
  const highestEnergyLevel = sublevels[sublevels.length - 1];

  // Extract the number of electrons in the last sublevel
  const match = highestEnergyLevel.match(/(\d+)([spdf])(\d+)/);

  if (match) {
    const [_, level, sublevel, electrons] = match;
    return {
      sublevel: `${level}${sublevel}`,
      valenceElectrons: parseInt(electrons, 10),
      orbital: sublevel, // s, p, d, or f
    };
  }

  return {
    sublevel: 'N/A',
    valenceElectrons: 0,
    orbital: 'N/A',
  };
};

// Define the properties for each orbital type as key-value pairs
const orbitalProperties: Record<string, Record<string, string>> = {
  s: {
    'Chemical Reactivity': 'Highly reactive, loses electrons easily',
    'Ionization Energy': 'Low',
    'Electronegativity': 'Low',
    'Atomic and Ionic Size': 'Small atomic size, cations are smaller',
    'Oxidation States': 'Mostly +1 or +2',
    'Electrical Conductivity': 'Good conductor due to free electrons',
    'Magnetic Properties': 'Weak or absent',
    'Metallic vs Non-metallic Character': 'Metallic character, reactive metals',
    'Melting and Boiling Points': 'Low melting points',
    'Electron Affinity': 'Low, typically forms cations',
    'Covalent Bonding': 'Forms ionic bonds or weak covalent bonds',
    'Lattice Energy': 'Relatively low',
    'Hardness and Malleability': 'Soft and malleable',
    'Coordination Chemistry': 'N/A',
    'Color of Compounds': 'N/A',
    'Polarity of Molecules': 'Low polarity',
    'Bond Angles and Molecular Geometry': 'Simple geometry due to low repulsion',
  },
  p: {
    'Chemical Reactivity': 'Varied reactivity, tends to share/gain electrons',
    'Ionization Energy': 'Medium to high',
    'Electronegativity': 'High',
    'Atomic and Ionic Size': 'Larger atomic size, anions are larger',
    'Oxidation States': 'From +3 to -3',
    'Electrical Conductivity': 'Poor conductor, except in specific cases',
    'Magnetic Properties': 'Weak, often diamagnetic',
    'Metallic vs Non-metallic Character': 'Non-metallic character increases',
    'Melting and Boiling Points': 'Medium to high melting points',
    'Electron Affinity': 'High, forms anions easily',
    'Covalent Bonding': 'Forms strong covalent bonds',
    'Lattice Energy': 'Higher due to strong ionic bonds',
    'Hardness and Malleability': 'Brittle (non-metals)',
    'Coordination Chemistry': 'N/A',
    'Color of Compounds': 'N/A',
    'Polarity of Molecules': 'High polarity, polar covalent bonds',
    'Bond Angles and Molecular Geometry': 'More complex geometry due to lone pairs',
  },
  d: {
    'Chemical Reactivity': 'Variable reactivity, forms transition metal compounds',
    'Ionization Energy': 'Varies',
    'Electronegativity': 'Varies',
    'Atomic and Ionic Size': 'Medium atomic size, varied ionic sizes',
    'Oxidation States': 'Multiple oxidation states',
    'Electrical Conductivity': 'Excellent conductor due to delocalized d-electrons',
    'Magnetic Properties': 'Strong magnetic properties (unpaired d-electrons)',
    'Metallic vs Non-metallic Character': 'Metallic character, transition metals',
    'Melting and Boiling Points': 'High melting and boiling points',
    'Electron Affinity': 'Varies',
    'Covalent Bonding': 'Forms covalent or metallic bonds',
    'Lattice Energy': 'Very high due to strong metallic bonds',
    'Hardness and Malleability': 'Hard and malleable',
    'Coordination Chemistry': 'Very important for complex formation',
    'Color of Compounds': 'Transition metal compounds are often colored',
    'Polarity of Molecules': 'Varies, polar or non-polar',
    'Bond Angles and Molecular Geometry': 'Complex geometry due to multiple bonding interactions',
  },
  f: {
    'Chemical Reactivity': 'Rare and mostly radioactive, complex reactivity',
    'Ionization Energy': 'Low to very low',
    'Electronegativity': 'Low',
    'Atomic and Ionic Size': 'Large atomic and ionic sizes',
    'Oxidation States': 'Typically +3, some +2 or +4',
    'Electrical Conductivity': 'Poor to good conductor depending on element',
    'Magnetic Properties': 'Varied magnetic properties',
    'Metallic vs Non-metallic Character': 'Metallic character, heavy metals',
    'Melting and Boiling Points': 'Very high melting points',
    'Electron Affinity': 'Very low',
    'Covalent Bonding': 'Forms complex ionic and covalent bonds',
    'Lattice Energy': 'Extremely high for ionic bonds',
    'Hardness and Malleability': 'Varied',
    'Coordination Chemistry': 'Important for forming f-block complexes',
    'Color of Compounds': 'Colored compounds due to f-electron transitions',
    'Polarity of Molecules': 'N/A',
    'Bond Angles and Molecular Geometry': 'Highly complex due to shielding effects',
  },
};

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
  // Get the appropriate configuration based on the notation
  const electronConfiguration = useNobleGasNotation
    ? element.nobleGasConfiguration
    : element.electronConfiguration;

  // Calculate valence electrons and sub-energy level
  const { sublevel, valenceElectrons, orbital } = getValenceElectrons(electronConfiguration);

  // Get the properties based on the orbital type
  const properties = orbitalProperties[orbital] || { 'No properties available': 'N/A' };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {element.name} (#{element.atomicNumber})
      </h2>
      <p className="text-xl mb-4">
        Electron Configuration: {electronConfiguration}
      </p>
      <p className="text-xl mb-4">
        <strong>Valence Electrons:</strong> {valenceElectrons}
      </p>
      <p className="text-xl mb-4">
        <strong>Sub-energy Level:</strong> {sublevel}
      </p>

      <h3 className="text-xl font-bold mb-2">Properties:</h3>
      <ul className="list-disc list-inside mb-4">
        {Object.entries(properties).map(([key, value], index) => (
          <li key={index}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>

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
