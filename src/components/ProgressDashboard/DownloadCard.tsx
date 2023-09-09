// FileDownloadCard.tsx
import React from 'react';
import ProgressBar from './ProgressBar';
import './DownloadCard.css';

interface FileDownloadCardProps {
  video: {
    title: string;
    progress: number;
    status: string;
  };
}

const DownloadCard: React.FC<FileDownloadCardProps> = ({ video }) => {
  return (
    <div className="download-card">
      <span className="download-title">{video.title}</span>
      <ProgressBar progress={video.progress} />
      <span className="download-status">{video.status}</span>
    </div>
  );
}

export default DownloadCard;