import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from './input';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

// Mock data for suggestions
const mockSuggestions = [
  "python",
  "data analyst (python)",
  "log, monitor, and debug data pipelines with python",
  "cleaning and working with dataframes in python",
  "decoding sensor data using python",
  "javaScript basics",
];

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsOpen(false);
  };

  return (
    <div ref={searchContainerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to learn today"
          className="w-64 pl-9 text-black"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-[300px] overflow-y-auto z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-4 py-2 cursor-pointer text-sm ${
                index === selectedIndex
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};