import React, { useState } from 'react';
import '../assets/css/sortby.css';

const SortBy = () => {
  const [selectedOption, setSelectedOption] = useState('None');
  
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="sortby-container">
      <label className="sortby-label">Sort by</label>
      <select className="sortby-select" value={selectedOption} onChange={handleOptionChange}>
        <option value="None">None</option>
      </select>
    </div>
  );
};

export default SortBy;
