import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when search bar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Tìm kiếm:', searchQuery);
      onSearch?.(searchQuery);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Optional: Call onSearch for real-time search
    if (query.trim()) {
      onSearch?.(query);
    }
  };

  return (
    <div className="search-bar-wrapper" ref={searchRef}>
      {/* Search Icon */}
      <div
        className="search-icon-container"
        onMouseEnter={() => setIsOpen(true)}
      >
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>

      {/* Search Bar */}
      <div
        className={`search-bar-container ${isOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => {
          setIsOpen(false);
        }}
      >
        <form onSubmit={handleSearch} className="search-form">
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={handleInputChange}
            className="search-input"
            onFocus={() => setIsOpen(true)}
          />
          <button type="submit" className="search-submit-btn" title="Tìm kiếm">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
