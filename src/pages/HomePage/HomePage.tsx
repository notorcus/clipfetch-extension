// HomePage.tsx
import React, { useState, useEffect } from 'react';
import LinkInput from './components/LinkInput';
import DownloadButton from './components/DownloadButton';
import QualityDropdown from './components/QualityDropdown';
import { getAvailableFormats } from '../../../backend/DownloadManager/DownloadUtils';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');  
  const [videoOptions, setVideoOptions] = useState<{ [resolution: string]: string }>({});
  const [audioOptions, setAudioOptions] = useState<any[]>([]);

  useEffect(() => {
    if (inputValue) {
      getAvailableFormats(inputValue, (error, bestFormatsByResolution, bestAudioFormats) => {
        if (error) {
          console.error('Failed to get formats:', error);
        } else {
          const videoOpts: { [resolution: string]: string } = {};
          Object.keys(bestFormatsByResolution).forEach(resolution => {
            videoOpts[resolution] = bestFormatsByResolution[resolution].format_id;
          });
          setVideoOptions(videoOpts);

          // Set audioOptions
          setAudioOptions(bestAudioFormats.map((format: { friendlyName: any; }) => format.friendlyName));
        }
      });
    }
  }, [inputValue]);

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
          <QualityDropdown options={Object.keys(videoOptions)} label="Video Quality" />
          <QualityDropdown options={audioOptions} label="Audio Quality" />
        </div>
      )}
      <DownloadButton inputValue={inputValue} />
    </div>
  );  
};

export default HomePage;
