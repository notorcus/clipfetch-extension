// FileDownloadCard.tsx
import React from 'react';
import ProgressBar from './ProgressBar';
import './DownloadCard.css';
import DownloadStateIcon from './DownloadStateIcon';

interface FileDownloadCardProps {
  video: {
    title: string;
    progress: number;
    status: 'downloading' | 'completed' | 'failed';
  };
}

const DownloadCard: React.FC<FileDownloadCardProps> = ({ video }) => {

  const handleCancel = () => {
    // Logic to cancel the video download goes here
    // For now, it's a placeholder function
    console.log(`Cancelling download for ${video.title}`);
  };

  return (
    <div className="download-card">
      <span className="download-title">{video.title}</span>
      <ProgressBar progress={video.progress} />
      <DownloadStateIcon state={video.status} onCancel={handleCancel} />
    </div>
  );
}

export default DownloadCard;