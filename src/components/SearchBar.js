import React from 'react';
import './SearchBar.css';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 메모 검색..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <button className="btn-clear" onClick={() => onSearchChange('')}>
          ✖️
        </button>
      )}
    </div>
  );
}

export default SearchBar;
