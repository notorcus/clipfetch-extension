// DownloadCard.tsx
import React, { useCallback } from 'react';
import ProgressBar from './ProgressBar';
import './DownloadCard.css';
import DownloadStateIcon from './DownloadStateIcon';

interface DownloadCardProps {
  video: {
    id: number;
    title: string;
    progress: number;
    status: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed';
  };
  onStatusChange: (videoId: number, status: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed') => void;
}

const DownloadCard: React.FC<DownloadCardProps> = ({ video, onStatusChange }) => {

  const handleCancel = useCallback(() => {
    onStatusChange(video.id, 'cancelled');
  }, [video.title, video.id, onStatusChange]);
  
  const handleRemove = useCallback(() => {
    onStatusChange(video.id, 'removed');
  }, [video.title, video.id, onStatusChange]);  

  return (
    <div className="download-card">
      <span className="download-title">{video.title}</span>
      <ProgressBar progress={video.progress} />
      <DownloadStateIcon 
        id={video.id} 
        state={video.status} 
        onCancel={handleCancel}
        onRemove={handleRemove}
      />
    </div>
  );
}

export default DownloadCard;