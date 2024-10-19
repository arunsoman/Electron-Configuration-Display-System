import React, { useState } from 'react';
import { Element } from '../types';
import elementData from '../data/elements.json';

interface SearchBarProps {
  onElementSelect: (element: Element) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onElementSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Element[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = elementData.filter(
        (element: Element) =>
          element.name.toLowerCase().includes(value.toLowerCase()) ||
          element.symbol.toLowerCase().includes(value.toLowerCase()) ||
          element.atomicNumber.toString().includes(value)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (element: Element) => {
    onElementSelect(element);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name, symbol, or atomic number"
        className="w-full p-2 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded mt-1">
          {suggestions.map((element) => (
            <li
              key={element.atomicNumber}
              onClick={() => handleSelect(element)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {element.name} ({element.symbol}) - {element.atomicNumber}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;