import React, { useState } from 'react';
import LinkInput from './components/LinkInput';
import ToggleButton from './components/ToggleButton';
import DownloadButton from './components/DownloadButton';
import SettingsButton from './components/SettingsButton'; // Import the SettingsButton component
import './HomePage.css';

interface HomePageProps {
  goToSettings: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ goToSettings }) => {
  const [inputValue, setInputValue] = useState('');  
  const [isActiveMap, setIsActiveMap] = useState({
    combined: false,
    video: false,
    audio: false
  });

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleToggle = (type: string, isActive: boolean) => {
    setIsActiveMap({ ...isActiveMap, [type]: isActive });
  };

  return (
    <div className="home-page-container">
      <div className="link-input-download-container">
        <LinkInput onInputChange={handleInputChange} />
        <DownloadButton 
          inputValue={inputValue} 
          isVideoActive={isActiveMap.video} 
          isAudioActive={isActiveMap.audio} 
          isCombinedActive={isActiveMap.combined} 
        />
      </div>
      <div className="toggle-button-settings-container">
        <div className="toggle-settings-pair-container">
          <ToggleButton 
            label="Combined" 
            id="ToggleCombinedButton" 
            isActive={isActiveMap.combined} 
            onToggle={(isActive) => handleToggle('combined', isActive)} 
            goToSettingsPage={goToSettings} 
          />
          <SettingsButton route="/settings/combined" isActive={isActiveMap.combined} goToSettingsPage={goToSettings} />
        </div>
        <div className="toggle-settings-pair-container">
          <ToggleButton 
            label="Video Only" 
            id="ToggleVideoOnlyButton" 
            isActive={isActiveMap.video} 
            onToggle={(isActive) => handleToggle('video', isActive)} 
            goToSettingsPage={goToSettings} 
          />
          <SettingsButton route="/settings/video-only" isActive={isActiveMap.video} goToSettingsPage={goToSettings} />
        </div>
        <div className="toggle-settings-pair-container">
          <ToggleButton 
            label="Audio Only" 
            id="ToggleAudioOnlyButton" 
            isActive={isActiveMap.audio} 
            onToggle={(isActive) => handleToggle('audio', isActive)} 
            goToSettingsPage={goToSettings} 
          />
          <SettingsButton route="/settings/audio-only" isActive={isActiveMap.audio} goToSettingsPage={goToSettings} />
        </div>
      </div>
    </div>
  );  
};

export default HomePage;
