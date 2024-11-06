import React, { useState } from 'react';
import '../assets/css/searchbar.css';
import searchIcon from '../assets/icons/Search.jpg'; // Import icon

const SearchBar = () => {
  const [searchType, setSearchType] = useState('Name');
  const [query, setQuery] = useState('');

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log(`Searching for ${query} in ${searchType}`);
    // Thực hiện tìm kiếm hoặc gọi API tại đây
  };

  return (
    <div className="search-bar">
      <select 
        value={searchType} 
        onChange={handleSearchTypeChange} 
        className="search-type"
      >
        <option value="Name">Name</option>
        {/* Thêm các tùy chọn khác nếu cần */}
      </select>
      <input 
        type="text" 
        value={query} 
        onChange={handleQueryChange} 
        placeholder="Search..." 
        className="search-input" 
      />
      <button onClick={handleSearch} className="search-button">
        <img src={searchIcon} alt="Search Icon" className="search-icon" />
      </button>
    </div>
  );
};

export default SearchBar;
