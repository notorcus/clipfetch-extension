import React from 'react';
import ProgressBar from './ProgressBar';

interface VideoListItemProps {
  video: {
    title: string;
    progress: number;
    status: string;
  };
}

const VideoListItem: React.FC<VideoListItemProps> = ({ video }) => {
  return (
    <div className="video-list-item">
      <span>{video.title}</span>
      <ProgressBar progress={video.progress} />
      <span>{video.status}</span>
    </div>
  );
}

export default VideoListItem;
