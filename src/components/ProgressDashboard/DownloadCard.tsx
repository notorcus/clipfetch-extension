// DownloadCard.tsx
import React from 'react';
import ProgressBar from './ProgressBar';
import './DownloadCard.css';
import DownloadStateIcon from './DownloadStateIcon';

interface DownloadCardProps {
  video: {
    title: string;
    progress: number;
    status: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed';
  };
  onStatusChange: (status: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed') => void;
}

const DownloadCard: React.FC<DownloadCardProps> = ({ video, onStatusChange }) => {

  const handleCancel = () => {
    console.log(`Cancelling download for ${video.title}`);
    onStatusChange('cancelled');
  };

  const handleRemove = () => {
    console.log(`Removing download card for ${video.title}`);
    onStatusChange('removed');
  };

  return (
    <div className="download-card">
      <span className="download-title">{video.title}</span>
      <ProgressBar progress={video.progress} />
      <DownloadStateIcon state={video.status} onCancel={handleCancel} onRemove={handleRemove} />
    </div>
  );
}

export default DownloadCard;