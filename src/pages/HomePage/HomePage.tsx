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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const isYouTube = platform?.toLowerCase() === 'youtube';
  const isDrive = platform?.toLowerCase() === 'googledrive';

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true);  // Start loading
      getAvailableFormats(inputValue, (error, bestFormatsByResolution, bestAudioFormats, videoTitle, platform) => {
        setIsLoading(false);  // Stop loading
        if (error) {
          setMessage('Invalid Link!');
          setHasError(true);  
        } else {
          setMessage(`${videoTitle}`);
          setHasError(false); 
          setPlatform(platform || null);
          console.log(platform);
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
        {message && <div className="message">{message}</div>}
        <LinkInput onInputChange={handleInputChange} />
        {isLoading && <div className="loading-bar"><div></div></div>}
      </div>
      {inputValue && !hasError && (
        <>
          <div className="dropdown-container">
            {Object.keys(videoOptions).length > 0 && (
              <QualityDropdown 
                options={Object.keys(videoOptions)} 
                label={isYouTube ? "Video Quality" : "Resolution"} 
                onSelect={(selected) => setSelectedVideoFormat(videoOptions[selected])} 
              />
            )}
            {isYouTube && Object.keys(audioOptions).length > 0 && (
              <QualityDropdown 
                options={Object.keys(audioOptions)} 
                label="Audio Quality" 
                onSelect={(selected) => setSelectedAudioFormat(audioOptions[selected])} 
              />
            )}
          </div>
          {isYouTube && Object.keys(videoOptions).length > 0 && Object.keys(audioOptions).length > 0 && (
            <div className="download-button-container">
              <DownloadButton 
                inputValue={inputValue} 
                videoFormatId={selectedVideoFormat} 
                audioFormatId={selectedAudioFormat} 
                platform={platform}
              />
            </div>
          )}
          {isDrive && Object.keys(videoOptions).length > 0 && (
            <div className="download-button-container">
              <DownloadButton 
                inputValue={inputValue} 
                videoFormatId={selectedVideoFormat} 
                audioFormatId={selectedAudioFormat} 
                platform={platform}
              />
            </div>
          )}
        </>
      )}
    </div>
  );  
};

export default HomePage;