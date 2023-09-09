// ProgressDashboard.tsx
import React, { useState, useEffect } from 'react';
import DownloadCard from './DownloadCard';
import './DashboardStyles.css';

interface Video {
  title: string;
  progress: number;
  status: string; // can be 'downloading', 'completed', 'failed'
}

interface ProgressDashboardProps {
  isOpen: boolean;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ isOpen }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  const addDummyVideo = () => {
    const dummyVideo: Video = {
      title: `Dummy Video ${videos.length + 1}`,
      progress: Math.floor(Math.random() * 101), // Random progress between 0 and 100
      status: 'downloading'
    };

    setVideos(prevVideos => [...prevVideos, dummyVideo]);
  };

  return (
    <div className={`progress-dashboard ${isOpen ? "visible" : "hidden"}`}>
      <button onClick={addDummyVideo}>Add Dummy Video</button>
      {videos.map(video => (
        <DownloadCard key={video.title} video={video} />
      ))}
    </div>
  );
}

export default ProgressDashboard;
