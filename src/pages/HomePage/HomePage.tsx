// HomePage.tsx
import React, { useState } from 'react';
import LinkInput from './components/LinkInput';
import DownloadButton from './components/DownloadButton';
import QualityDropdown from './components/QualityDropdown';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');  

  // Dummy options for testing
  const videoOptions = ['none', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];
  const audioOptions = ['none', '320kbps', '256kbps', '192kbps'];

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  return (
    <div className="home-page-container">
      <div className="link-input-container">
        <LinkInput onInputChange={handleInputChange} />
      </div>
      {inputValue && (
        <div className="dropdown-container">
          <QualityDropdown options={videoOptions} label="Video Quality" />
          <QualityDropdown options={audioOptions} label="Audio Quality" />
        </div>
      )}
      <DownloadButton inputValue={inputValue} />
    </div>
  );  
};

export default HomePage;
