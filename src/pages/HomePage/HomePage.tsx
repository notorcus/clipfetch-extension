// HomePage.tsx
import React, { useState, useEffect } from 'react';
import LinkInput from './components/LinkInput';
import DownloadButton from './components/DownloadButton';
import QualityDropdown from './components/QualityDropdown';
import { getAvailableFormats } from '../../../backend/DownloadManager/DownloadUtils';
import './HomePage.css';

const HomePage: React.FC<{
  onProgressUpdate: (id: number, progress: number) => void,
  onNewVideoDownload: (id: number, title: string) => void
}> = ({ onProgressUpdate, onNewVideoDownload }) => {
  const [inputValue, setInputValue] = useState('');  
  const [videoOptions, setVideoOptions] = useState<{ [resolution: string]: string }>({});
  const [audioOptions, setAudioOptions] = useState<{ [friendlyName: string]: string }>({});
  const [selectedVideoFormat, setSelectedVideoFormat] = useState<string>('');
  const [selectedAudioFormat, setSelectedAudioFormat] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const isYouTube = platform?.trim().toLowerCase() === 'youtube';
  const isDrive = platform?.trim().toLowerCase() === 'googledrive';
  
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
      
          // Derive isYouTube directly from the platform parameter, not the state
          const currentIsYouTube = platform?.trim().toLowerCase() === 'youtube';
      
          // Setting video and audio options
          // console.log("Video Formats:", bestFormatsByResolution)
          setVideoOptions(bestFormatsByResolution);
          setAudioOptions(bestAudioFormats);
      
          // Set the default selected formats to the highest quality options using the fetched formats directly
          const firstVideoOptionKey = Object.keys(bestFormatsByResolution)[0];
          setSelectedVideoFormat(firstVideoOptionKey);

          if (currentIsYouTube) {
              const firstAudioOptionKey = Object.keys(bestAudioFormats)[0];
              setSelectedAudioFormat(firstAudioOptionKey);
          }
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
                selected={selectedVideoFormat}
                onSelect={(selected) => setSelectedVideoFormat(selected)} 
              />
            )}
            {isYouTube && Object.keys(audioOptions).length > 0 && (
              <QualityDropdown 
                options={Object.keys(audioOptions)} 
                label="Audio Quality" 
                selected={selectedAudioFormat}
                onSelect={(selected) => setSelectedAudioFormat(selected)} 
              />
            )}
          </div>
          {isYouTube && Object.keys(videoOptions).length > 0 && Object.keys(audioOptions).length > 0 && (
            <div className="download-button-container">
              <DownloadButton 
                inputValue={inputValue} 
                videoFormatId={videoOptions[selectedVideoFormat]} 
                audioFormatId={audioOptions[selectedAudioFormat]} 
                platform={platform}
                onProgressUpdate={onProgressUpdate}
                onNewVideoDownload={onNewVideoDownload}
              />
            </div>
          )}
          {isDrive && Object.keys(videoOptions).length > 0 && (
            <div className="download-button-container">
              <DownloadButton 
                inputValue={inputValue} 
                videoFormatId={videoOptions[selectedVideoFormat]} 
                audioFormatId={audioOptions[selectedAudioFormat]} 
                platform={platform}
                onProgressUpdate={onProgressUpdate}
                onNewVideoDownload={onNewVideoDownload}
              />
            </div>
          )}
        </>
      )}
    </div>
  );  
};

export default HomePage;