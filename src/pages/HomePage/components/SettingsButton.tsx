// SettingsButton.tsx
import React from 'react';
import './SettingsButton.css';

interface SettingsButtonProps {
  route: string;
  isActive: boolean;
  goToSettingsPage: () => void;  // <-- New prop here
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ route, isActive, goToSettingsPage }) => {
  const navigateToSettings = () => {
    if (isActive) {
      // Logic to navigate to the settings page
      goToSettingsPage();  // <-- Call the function to navigate
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
