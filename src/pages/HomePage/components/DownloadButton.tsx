// DownloadButton.tsx
import React, { useContext } from 'react';
import { initiateDownload } from '../../../../backend/DownloadManager/Main';
import { DownloadSettingsContext } from '../../../DownloadSettingsContext';  // Update this import path
import './DownloadButton.css';

interface DownloadButtonProps {
  inputValue: string;
  videoFormatId: string;
  audioFormatId: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ inputValue, videoFormatId, audioFormatId }) => {
  const [settings] = useContext(DownloadSettingsContext);
  const { outputPath } = settings;

  const handleDownloadClick = async () => {
    if (inputValue === '') {
      console.log("Input field is empty.");
    } else {
      console.log("Download button clicked. Input value:", inputValue);

      try {
        await initiateDownload(inputValue, videoFormatId, audioFormatId, outputPath);
        console.log('Download succeeded.');
      } catch (error) {
        console.error('Download failed:', error);
      }
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