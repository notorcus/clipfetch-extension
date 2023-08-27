import React from 'react';
import './SettingsButton.css';

interface SettingsButtonProps {
  route: string;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ route }) => {
  const navigateToSettings = () => {
    // Logic to navigate to the settings page can go here
    console.log(`Navigate to ${route}`);
  };

  return (
    <button className="settings-button" onClick={navigateToSettings}>
      {/* You can replace this with an icon */}
      S
    </button>
  );
};

export default SettingsButton;
