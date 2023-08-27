import React from 'react';
import './DownloadButton.css';

const DownloadButton: React.FC = () => {

  const initiateDownload = () => {
    console.log("Download button clicked.");
  };

  return (
    <button className="download-button" onClick={initiateDownload}>
      {/* You can replace this with an icon */}
      D
    </button>
  );
};

export default DownloadButton;
