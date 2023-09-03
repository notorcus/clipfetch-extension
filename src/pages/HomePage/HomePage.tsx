import React, { useState } from 'react';
import LinkInput from './components/LinkInput';
import ToggleButton from './components/ToggleButton';
import DownloadButton from './components/DownloadButton';
import './HomePage.css';  // Make sure to create and update your CSS file

interface HomePageProps {
    goToSettings: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ goToSettings }) => {
  const [inputValue, setInputValue] = useState('');  // React state to store the input value
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isCombinedActive, setIsCombinedActive] = useState(false);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleToggle = (type: string, isActive: boolean) => {
    if (type === 'video') setIsVideoActive(isActive);
    if (type === 'audio') setIsAudioActive(isActive);
    if (type === 'combined') setIsCombinedActive(isActive);
  };

  return (
    <div className="home-page-container">
      {/* Global Wrapper Container */}
      <div className="global-wrapper">
        {/* Container for LinkInput and DownloadButton */}
        <div className="link-input-download-container">
          <LinkInput onInputChange={handleInputChange} />
          <DownloadButton 
            inputValue={inputValue} 
            isVideoActive={isVideoActive} 
            isAudioActive={isAudioActive} 
            isCombinedActive={isCombinedActive} 
          />
        </div>
        {/* Container for ToggleButtons and their SettingsButtons */}
        <div className="toggle-button-settings-container">
          <ToggleButton 
            label="Combined" 
            id="ToggleCombinedButton" 
            settingsRoute="/settings/combined" 
            isActive={isCombinedActive} 
            onToggle={(isActive) => handleToggle('combined', isActive)} 
            goToSettingsPage={goToSettings}
          />
          <ToggleButton 
            label="Video Only" 
            id="ToggleVideoOnlyButton" 
            settingsRoute="/settings/video-only" 
            isActive={isVideoActive} 
            onToggle={(isActive) => handleToggle('video', isActive)} 
            goToSettingsPage={goToSettings}
          />
          <ToggleButton 
            label="Audio Only" 
            id="ToggleAudioOnlyButton" 
            settingsRoute="/settings/audio-only" 
            isActive={isAudioActive} 
            onToggle={(isActive) => handleToggle('audio', isActive)} 
            goToSettingsPage={goToSettings} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
