// LinkInput.tsx
import React, { useState } from 'react';
import './LinkInput.css';
import ToggleButton from './ToggleButton';
import DownloadButton from './DownloadButton';

const LinkInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');  // React state to store the input value
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isCombinedActive, setIsCombinedActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleToggle = (type: string, isActive: boolean) => {
    if (type === 'video') setIsVideoActive(isActive);
    if (type === 'audio') setIsAudioActive(isActive);
    if (type === 'combined') setIsCombinedActive(isActive);
  };

  return (
    <div className="link-input-container">
      <div className="input-with-button">
        <input 
          type="text" 
          className="link-input-field" 
          placeholder="Enter link..." 
          value={inputValue}
          onChange={handleInputChange} // Update state on input change
        />
        <DownloadButton 
          inputValue={inputValue} 
          isVideoActive={isVideoActive} 
          isAudioActive={isAudioActive} 
          isCombinedActive={isCombinedActive} 
        />
      </div>
      <ToggleButton 
        label="Combined" 
        id="ToggleCombinedButton" 
        settingsRoute="/settings/combined" 
        isActive={isCombinedActive} 
        onToggle={(isActive) => handleToggle('combined', isActive)} 
      />
      <ToggleButton 
        label="Video Only" 
        id="ToggleVideoOnlyButton" 
        settingsRoute="/settings/video-only" 
        isActive={isVideoActive} 
        onToggle={(isActive) => handleToggle('video', isActive)} 
      />
      <ToggleButton 
        label="Audio Only" 
        id="ToggleAudioOnlyButton" 
        settingsRoute="/settings/audio-only" 
        isActive={isAudioActive} 
        onToggle={(isActive) => handleToggle('audio', isActive)} 
      />
    </div>
  );
};

export default LinkInput;
