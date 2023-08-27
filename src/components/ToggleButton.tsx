import React, { useState } from 'react';
import './ToggleButton.css';
import SettingsButton from './SettingsButton';  // Import the new component

interface ToggleButtonProps {
  label: string;
  id: string;
  settingsRoute: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, id, settingsRoute }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleButton = () => {
    setIsActive(!isActive);
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
