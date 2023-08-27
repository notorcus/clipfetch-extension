import React from 'react';
import './LinkInput.css';
import ToggleButton from './ToggleButton';

const LinkInput: React.FC = () => {
  return (
    <div className="link-input-container">
      <input type="text" className="link-input-field" placeholder="Enter link..." />
      <ToggleButton label="Combined" id="ToggleCombinedButton" settingsRoute="/settings/combined" />
      <ToggleButton label="Video Only" id="ToggleVideoOnlyButton" settingsRoute="/settings/video-only" />
      <ToggleButton label="Audio Only" id="ToggleAudioOnlyButton" settingsRoute="/settings/audio-only" />
    </div>
  );
};

export default LinkInput;
