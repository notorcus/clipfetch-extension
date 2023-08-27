import React from 'react';
import './LinkInput.css';
import ToggleButton from './ToggleButton';  // Import the new component

const LinkInput: React.FC = () => {
  return (
    <div className="link-input-container">
      <input type="text" className="link-input-field" placeholder="Enter link..." />
      <ToggleButton label="Combined" id="ToggleCombinedButton" />
      <ToggleButton label="Video Only" id="ToggleVideoOnlyButton" />
      <ToggleButton label="Audio Only" id="ToggleAudioOnlyButton" />
    </div>
  );
};

export default LinkInput;
