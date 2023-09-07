// QualityDropdown.tsx
import React, { useState, useEffect } from 'react';
import './QualityDropdown.css';

interface QualityDropdownProps {
  options: string[];
  label: string;
  onSelect: (selected: string) => void;
}

const QualityDropdown: React.FC<QualityDropdownProps> = ({ options, label, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update the selected option whenever the options prop changes
    setSelectedOption(options[0]);
  }, [options]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className="Quality-dropdown-container" tabIndex={0} onBlur={() => setIsOpen(false)}>
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

export default QualityDropdown;
