// SettingsButton.tsx
import React from 'react';
import './SettingsButton.css';

interface SettingsButtonProps {
  route: string;
  isActive: boolean;
  goToSettingsPage: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ route, isActive, goToSettingsPage }) => {
  const navigateToSettings = () => {
    if (isActive) {
      goToSettingsPage();
    }
  };

  return (
    <button 
      className={`settings-button ${isActive ? '' : 'disabled'}`} 
      onClick={navigateToSettings}
    >
      S
    </button>
  );
};

export default SettingsButton;
