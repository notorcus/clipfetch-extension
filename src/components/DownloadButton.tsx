// DownloadButton.tsx
import React from 'react';
import './DownloadButton.css';
import { initiateDownload as initiateDownloadFromBackend } from '../../backend/DownloadManager/Main';  // Assuming this is where your initiateDownload function resides

interface DownloadButtonProps {
  inputValue: string;
  isVideoActive: boolean;
  isAudioActive: boolean;
  isCombinedActive: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ inputValue, isVideoActive, isAudioActive, isCombinedActive }) => {
  const initiateDownload = () => {
    if (inputValue === '') {
      console.log("Input field is empty.");
    } else {
      console.log("Download button clicked. Input value:", inputValue);
      console.log("Video Active:", isVideoActive);
      console.log("Audio Active:", isAudioActive);
      console.log("Combined Active:", isCombinedActive);

      // Update your DownloadSettings here based on the toggle states
      // ...

      // Call the initiateDownload function from your Main.ts (backend)
      initiateDownloadFromBackend(
        inputValue, 
        isVideoActive, 
        isAudioActive, 
        isCombinedActive, 
        (error: any, data: any) => {
          if (error) {
            console.error("Download failed:", error);
          } else {
            console.log("Download succeeded:", data);
          }
        }
      );
    }
  };

  return (
    <button className="download-button" onClick={initiateDownload}>
      {/* You can replace this with an icon */}
      D
    </button>
  );
};

export default DownloadButton;
