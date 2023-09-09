// ProgressDashboard.tsx
import React, { useState, useEffect } from 'react';
import DownloadCard from './DownloadCard';
import DownloadStateIcon from './DownloadStateIcon';
import './DashboardStyles.css';

interface Video {
  title: string;
  progress: number;
  status: 'downloading' | 'completed' | 'failed'| 'cancelled';
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

  const handleStatusChange = (videoTitle: string, newStatus: 'downloading' | 'completed' | 'failed' | 'cancelled') => {
    setVideos(prevVideos => {
      return prevVideos.map(video => {
        if (video.title === videoTitle) {
          return { ...video, status: newStatus };
        }
        return video;
      });
    });
  }

  return (
    <div className={`progress-dashboard ${isOpen ? "visible" : "hidden"}`}>
      <button onClick={addDummyVideo}>Add Dummy Video</button>
      {videos.map(video => (
        <DownloadCard 
          key={video.title} 
          video={video} 
          onStatusChange={(newStatus) => handleStatusChange(video.title, newStatus)} 
        />
      ))}
    </div>
  );
}

export default ProgressDashboard;
