// ToggleButton.tsx
import React from 'react';
import './ToggleButton.css';
import SettingsButton from './SettingsButton';

interface ToggleButtonProps {
  label: string;
  id: string;
  settingsRoute: string;
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, id, settingsRoute, isActive, onToggle }) => {
  const toggleButton = () => {
    onToggle(!isActive);
  };

  return (
    <div className="toggle-button-container">
      <button
        className={`toggle-button ${isActive ? 'active' : ''}`}
        id={id}
        onClick={toggleButton}
      >
        {label}
      </button>
      <SettingsButton route={settingsRoute} />
    </div>
  );
};

export default ToggleButton;
