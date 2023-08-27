import React, { useState } from 'react';
import './LinkInput.css';
import ToggleButton from './ToggleButton';
import DownloadButton from './DownloadButton';

const LinkInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');  // React state to store the input value

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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
        <DownloadButton inputValue={inputValue} />
      </div>
      <ToggleButton label="Combined" id="ToggleCombinedButton" settingsRoute="/settings/combined" />
      <ToggleButton label="Video Only" id="ToggleVideoOnlyButton" settingsRoute="/settings/video-only" />
      <ToggleButton label="Audio Only" id="ToggleAudioOnlyButton" settingsRoute="/settings/audio-only" />
    </div>
  );
};

export default LinkInput;
