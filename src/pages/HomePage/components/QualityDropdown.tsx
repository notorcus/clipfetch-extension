import React from 'react';
import './QualityDropdown.css';

interface QualityDropdownProps {
  videoOptions: string[];
  audioOptions: string[];
}

const QualityDropdown: React.FC<QualityDropdownProps> = ({ videoOptions, audioOptions }) => {
  return (
    <div className="quality-dropdown-container">
      <select className="quality-dropdown">
        {videoOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select className="quality-dropdown">
        {audioOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default QualityDropdown;
