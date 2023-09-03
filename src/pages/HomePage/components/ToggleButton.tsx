// ToggleButton.tsx
import React from 'react';
import './ToggleButton.css';

interface ToggleButtonProps {
  label: string;
  id: string;
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
  goToSettingsPage: () => void;  // <-- New prop added here
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, id, isActive, onToggle, goToSettingsPage }) => {
  const toggleButton = () => {
    onToggle(!isActive);
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
