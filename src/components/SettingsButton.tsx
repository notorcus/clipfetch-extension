// SettingsButton.tsx
import React from 'react';
import './SettingsButton.css';

interface SettingsButtonProps {
  route: string;
  isActive: boolean;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ route, isActive }) => {
  const navigateToSettings = () => {
    if (isActive) {
      // Logic to navigate to the settings page can go here
      console.log(`Navigate to ${route}`);
    }
  };

  return (
    <button 
      className={`settings-button ${isActive ? '' : 'disabled'}`} 
      onClick={navigateToSettings}
    >
      {/* You can replace this with an icon */}
      S
    </button>
  );
};

export default SettingsButton;
