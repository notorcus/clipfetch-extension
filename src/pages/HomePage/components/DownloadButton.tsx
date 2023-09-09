// DownloadButton.tsx
import React, { useContext } from 'react';
import { downloadDrive, downloadYT } from '../../../../backend/DownloadManager/Main';
import { DownloadSettingsContext } from '../../../DownloadSettingsContext'; 
import './DownloadButton.css';

interface DownloadButtonProps {
  inputValue: string;
  videoFormatId: string;
  audioFormatId: string;
  platform: string | null;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ inputValue, videoFormatId, audioFormatId, platform }) => {
  const [settings] = useContext(DownloadSettingsContext);
  const { outputPath } = settings;

  const handleDownloadClick = async () => {
    if (inputValue === '') {
      console.log("Input field is empty.");
      return;
    }

    try {
      if (platform?.toLowerCase() === 'youtube') {
        await downloadYT(inputValue, videoFormatId, audioFormatId, outputPath, (progress) => {
          console.log(`Video Download Progress: ${progress.toFixed(0)}%`);
        });
      } else if (platform?.toLowerCase() === 'googledrive') {
        await downloadDrive(inputValue, videoFormatId, outputPath);
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
