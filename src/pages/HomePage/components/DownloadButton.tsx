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
  onProgressUpdate: (title: string, progress: number) => void;
  onNewVideoDownload: (title: string) => void;
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
      if (platform?.toLowerCase() === 'youtube') {
        const videoTitle = await getVideoTitle(inputValue);
        // console.log("Video Format ID:", videoFormatId);
        // console.log("Audio Format ID:", audioFormatId);
        onNewVideoDownload(videoTitle);

        await downloadYT(inputValue, videoFormatId, audioFormatId, outputPath, (progress) => {
          onProgressUpdate(videoTitle, progress);
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
