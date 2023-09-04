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
  const [audioOptions, setAudioOptions] = useState<{ [friendlyName: string]: string }>({});
  const [selectedVideoFormat, setSelectedVideoFormat] = useState<string>('');
  const [selectedAudioFormat, setSelectedAudioFormat] = useState<string>('');


  useEffect(() => {
    if (inputValue) {
      getAvailableFormats(inputValue, (error, bestFormatsByResolution, bestAudioFormats) => {
        if (error) {
          console.error('Failed to get formats:', error);
        } else {

          // console.log("Best audio formats received:", bestAudioFormats);
  
          // Set video options
          const videoOpts: { [resolution: string]: string } = {};
          Object.keys(bestFormatsByResolution).forEach(resolution => {
            videoOpts[resolution] = bestFormatsByResolution[resolution].format_id;
          });
          setVideoOptions(videoOpts);
  
          // Set audio options
          setAudioOptions(bestAudioFormats); 

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
        <>
          <div className="dropdown-container">
            {Object.keys(videoOptions).length > 0 && (
              <QualityDropdown 
                options={Object.keys(videoOptions)} 
                label="Video Quality" 
                onSelect={(selected) => setSelectedVideoFormat(videoOptions[selected])} 
              />
            )}
            {Object.keys(audioOptions).length > 0 && (
              <QualityDropdown 
                options={Object.keys(audioOptions)} 
                label="Audio Quality" 
                onSelect={(selected) => setSelectedAudioFormat(audioOptions[selected])} 
              />
            )}
          </div>
          {/* Show DownloadButton only if both dropdowns have options */}
          {(Object.keys(videoOptions).length > 0 && Object.keys(audioOptions).length > 0) && (
            <div className="download-button-container">
              <DownloadButton 
                inputValue={inputValue} 
                videoFormatId={selectedVideoFormat} 
                audioFormatId={selectedAudioFormat} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );  
};

export default HomePage;
