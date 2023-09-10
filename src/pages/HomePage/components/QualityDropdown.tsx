// QualityDropdown.tsx
import React, { useState, useEffect } from 'react';
import './QualityDropdown.css';

interface QualityDropdownProps {
  options: string[];
  label: string;
  selected: string;
  onSelect: (selected: string) => void;
}

const QualityDropdown: React.FC<QualityDropdownProps> = ({ options, label, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    setIsOpen(false);
    onSelect(option);
  };
  
  return (
    <div className="Quality-dropdown-container" tabIndex={0} onBlur={() => setIsOpen(false)}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        <span>{label}: {selected}</span>
        <span className="arrow down"></span>
      </div>
      {isOpen && (
        <div className="options-container">
          {options.map((option, index) => (
            <div 
              key={index} 
              className="option" 
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QualityDropdown;
