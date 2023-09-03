// DownloadButton.tsx
import React from 'react';
import './DownloadButton.css';

interface DownloadButtonProps {
  inputValue: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ inputValue }) => {
  const initiateDownload = () => {
    if (inputValue === '') {
      console.log("Input field is empty.");
    } else {
      console.log("Download button clicked. Input value:", inputValue);
      // Dummy function to simulate the download initiating.
      console.log("Initiating download...");
    }
  };

  return (
    <button className="download-button" onClick={initiateDownload}>
      {/* You can replace this with an icon */}
      Download
    </button>
  );
};

export default DownloadButton;
