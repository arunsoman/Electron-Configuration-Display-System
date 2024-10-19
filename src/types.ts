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