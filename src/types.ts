export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  electronConfiguration: string;
  nobleGasConfiguration: string;
}

export interface Orbital {
  name: string;
  capacity: number;
  electrons: number;
  shape: string;
}

// Represents an energy level (n) with the total number of electrons in that level
export interface EnergyLevel {
  level: number;          // Principal quantum number (n)
  totalElectrons: number; // Total number of electrons in this energy level
}