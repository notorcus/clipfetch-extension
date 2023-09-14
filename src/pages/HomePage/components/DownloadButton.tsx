// DownloadButton.tsx
import React, { useContext } from 'react';
import { downloadDrive, downloadYT } from '../../../../backend/DownloadManager/Main';
import { getVideoTitle } from '../../../../backend/DownloadManager/DownloadUtils';
import { DownloadSettingsContext } from '../../../DownloadSettingsContext'; 
import './DownloadButton.css';

interface DownloadButtonProps {
  inputValue: string;
  videoFormatId: string;
  audioFormatId: string;
  platform: string | null;
  onProgressUpdate: (id: number, progress: number) => void;
  onNewVideoDownload: (id: number, title: string) => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  inputValue, videoFormatId, audioFormatId, platform, 
  onProgressUpdate, onNewVideoDownload
}) => {

  const [settings] = useContext(DownloadSettingsContext);
  const { outputPath } = settings;

  const handleDownloadClick = async () => {
    if (inputValue === '') {
      console.log("Input field is empty.");
      return;
    }
    
    try {

      const videoTitle = await getVideoTitle(inputValue);
      const videoId = Date.now();

      if (platform?.toLowerCase() === 'youtube') {

        onNewVideoDownload(videoId, videoTitle);

        await downloadYT(inputValue, videoFormatId, audioFormatId, outputPath, (progress) => {
          onProgressUpdate(videoId, progress);
        });
      } else if (platform?.toLowerCase() === 'googledrive') {
        
        onNewVideoDownload(videoId, videoTitle);

        await downloadDrive(inputValue, videoFormatId, outputPath, (progress) => {
          onProgressUpdate(videoId, progress);
        });
      }
      
      console.log('Download succeeded.');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <button className="download-button" onClick={handleDownloadClick}>
      {/* You can replace this with an icon */}
      Download
    </button>
  );
};

export default DownloadButton;
