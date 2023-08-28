import React from 'react';
import './DownloadButton.css';

const { downloadVideo } = require('../../backend/videoDownloader');

interface DownloadButtonProps {
  inputValue: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ inputValue }) => {

  const initiateDownload = () => {
    if (inputValue === '') {
      console.log("Input field is empty.");
    } else {
      console.log("Download button clicked. Input value:", inputValue);

      // Call the downloadVideo function from videoDownloader.js
      downloadVideo(inputValue, (error: any, data: any) => {
        if (error) {
          console.error("Download failed:", error);
        } else {
          console.log("Download succeeded:", data);
        }
      });
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