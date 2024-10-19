import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Element, Orbital } from '../types';

interface OrbitalVisualizationProps {
  element: Element;
}

const OrbitalVisualization: React.FC<OrbitalVisualizationProps> = ({ element }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };

    const orbitals: Orbital[] = parseElectronConfiguration(element.electronConfiguration);

    const x = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1)
      .domain(orbitals.map((d) => d.name));

    const y = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, d3.max(orbitals, (d) => d.capacity) || 0]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g').attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

    svg
      .selectAll('rect')
      .data(orbitals)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.name) || 0)
      .attr('y', (d) => y(d.electrons))
      .attr('width', x.bandwidth())
      .attr('height', (d) => y(0) - y(d.electrons))
      .attr('fill', (d) => getOrbitalColor(d.name));

    svg
      .selectAll('.orbital-label')
      .data(orbitals)
      .enter()
      .append('text')
      .attr('class', 'orbital-label')
      .attr('x', (d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.electrons) - 5)
      .attr('text-anchor', 'middle')
      .text((d) => d.electrons);
  }, [element]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-bold mb-4">Orbital Visualization</h3>
      <svg ref={svgRef} width="400" height="300"></svg>
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

function getOrbitalColor(name: string): string {
  const subshell = name[1];
  switch (subshell) {
    case 's':
      return '#FF6B6B';
    case 'p':
      return '#4ECDC4';
    case 'd':
      return '#45B7D1';
    case 'f':
      return '#FFA07A';
    default:
      return '#CCCCCC';
  }
}

export default OrbitalVisualization;