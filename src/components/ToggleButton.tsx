import React, { useState } from 'react';
import './ToggleButton.css';

interface ToggleButtonProps {
  label: string;
  id: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, id }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleButton = () => {
    setIsActive(!isActive);
  };

  return (
    <button
      className={`toggle-button ${isActive ? 'active' : ''}`}
      id={id}
      onClick={toggleButton}
    >
      {label}
    </button>
  );
};

export default ToggleButton;
