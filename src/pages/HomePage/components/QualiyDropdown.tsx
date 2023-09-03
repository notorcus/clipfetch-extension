// CustomDropdown.tsx
import React, { useState } from 'react';
import './QualityDropdown.css';

interface CustomDropdownProps {
  options: string[];
  label: string; // Add this line
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, label }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown-container" tabIndex={0} onBlur={() => setIsOpen(false)}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        <span>{label}: {selectedOption}</span>
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

export default CustomDropdown;
