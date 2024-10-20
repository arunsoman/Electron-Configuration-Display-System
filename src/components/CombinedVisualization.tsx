import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Element, Orbital } from '../types';

interface CombinedVisualizationProps {
  element: Element;
}

const CombinedVisualization: React.FC<CombinedVisualizationProps> = ({ element }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const orbitals = parseElectronConfiguration(element.electronConfiguration);

    const energyLevels = groupByEnergyLevel(orbitals);

    const x = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1)
      .domain(energyLevels.map((d) => `n=${d.level}`));

    const y = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, d3.max(energyLevels, (d) => d.totalElectrons) || 0]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

    const color = d3.scaleOrdinal()
      .domain(['s', 'p', 'd', 'f'])
      .range(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']);

    const levelGroups = svg
      .selectAll('g.level')
      .data(energyLevels)
      .enter()
      .append('g')
      .attr('class', 'level')
      .attr('transform', (d) => `translate(${x(`n=${d.level}`) || 0}, 0)`);

    levelGroups
      .selectAll('rect')
      .data((d) => d.sublevels)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => y(d.accumulatedElectrons))
      .attr('width', x.bandwidth())
      .attr('height', (d) => y(0) - y(d.electrons))
      .attr('fill', (d) => color(d.name[1]));

    levelGroups
      .selectAll('.sublevel-label')
      .data((d) => d.sublevels)
      .enter()
      .append('text')
      .attr('class', 'sublevel-label')
      .attr('x', x.bandwidth() / 2)
      .attr('y', (d) => y(d.accumulatedElectrons) - 5)
      .attr('text-anchor', 'middle')
      .text((d) => `${d.electrons}e`);
  }, [element]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-bold mb-4">Energy Level & Sublevel Visualization</h3>
      <svg ref={svgRef} width="600" height="400"></svg>
    </div>
  );
};

function parseElectronConfiguration(config: string): Orbital[] {
  const orbitals: Orbital[] = [];
  const regex = /(\d[spdf])(\d+)/g;
  let match;

  while ((match = regex.exec(config)) !== null) {
    const [, name, electrons] = match;
    orbitals.push({
      name,
      capacity: getOrbitalCapacity(name),
      electrons: parseInt(electrons, 10),
      shape: getOrbitalShape(name),
    });
  }

  return orbitals;
}

function groupByEnergyLevel(orbitals: Orbital[]) {
  const levels: { [key: number]: { level: number, sublevels: any[], totalElectrons: number } } = {};

  orbitals.forEach((orbital) => {
    const n = parseInt(orbital.name[0], 10); // extract the energy level (n)
    if (!levels[n]) {
      levels[n] = { level: n, sublevels: [], totalElectrons: 0 };
    }
    levels[n].totalElectrons += orbital.electrons;
    levels[n].sublevels.push({
      ...orbital,
      accumulatedElectrons: levels[n].totalElectrons,
    });
  });

  return Object.values(levels);
}

function getOrbitalCapacity(name: string): number {
  const subshell = name[1];
  switch (subshell) {
    case 's':
      return 2;
    case 'p':
      return 6;
    case 'd':
      return 10;
    case 'f':
      return 14;
    default:
      return 0;
  }
}

function getOrbitalShape(name: string): string {
  const subshell = name[1];
  switch (subshell) {
    case 's':
      return 'Spherical';
    case 'p':
      return 'Dumbbell-shaped';
    case 'd':
      return 'Complex (4-lobed)';
    case 'f':
      return 'Complex (8-lobed)';
    default:
      return 'Unknown';
  }
}

export default CombinedVisualization;
