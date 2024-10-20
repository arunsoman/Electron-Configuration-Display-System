import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Element, EnergyLevel } from '../types';

interface EnergyLevelVisualizationProps {
  element: Element;
}

const EnergyLevelVisualization: React.FC<EnergyLevelVisualizationProps> = ({ element }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };

    const energyLevels: EnergyLevel[] = parseEnergyLevels(element.electronConfiguration);

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

    svg
      .selectAll('rect')
      .data(energyLevels)
      .enter()
      .append('rect')
      .attr('x', (d) => x(`n=${d.level}`) || 0)
      .attr('y', (d) => y(d.totalElectrons))
      .attr('width', x.bandwidth())
      .attr('height', (d) => y(0) - y(d.totalElectrons))
      .attr('fill', '#69b3a2');

    svg
      .selectAll('.energy-level-label')
      .data(energyLevels)
      .enter()
      .append('text')
      .attr('class', 'energy-level-label')
      .attr('x', (d) => (x(`n=${d.level}`) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.totalElectrons) - 5)
      .attr('text-anchor', 'middle')
      .text((d) => d.totalElectrons);
  }, [element]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-bold mb-4">Energy Level Visualization</h3>
      <svg ref={svgRef} width="400" height="300"></svg>
    </div>
  );
};

function parseEnergyLevels(config: string): EnergyLevel[] {
  const energyLevels: EnergyLevel[] = [];
  const regex = /(\d)([spdf])(\d+)/g;
  const levels: { [key: number]: EnergyLevel } = {};
  let match;

  while ((match = regex.exec(config)) !== null) {
    const [_, level, subshell, electrons] = match;
    const n = parseInt(level, 10);
    const numElectrons = parseInt(electrons, 10);

    if (!levels[n]) {
      levels[n] = { level: n, totalElectrons: 0 };
    }
    levels[n].totalElectrons += numElectrons;
  }

  for (const key in levels) {
    energyLevels.push(levels[key]);
  }

  return energyLevels;
}

export default EnergyLevelVisualization;
