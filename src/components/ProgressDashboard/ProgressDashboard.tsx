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
      progress: 0, 
      status: 'downloading'
    };

    setVideos(prevVideos => [...prevVideos, dummyVideo]);

    const intervalTime = Math.random() * 250 + 100; // Random interval between 0.5s to 1.5s
    const incrementAmount = Math.random() * 25 + 1; // Random progress increment between 1 and 5

    const interval = setInterval(() => {
      setVideos(prevVideos => {
        return prevVideos.map(video => {
          if (video.title === dummyVideo.title) {
            const newProgress = video.progress + incrementAmount > 100 ? 100 : video.progress + incrementAmount;
            if (newProgress === 100) {
              clearInterval(interval);
              return { ...video, progress: 100, status: 'completed' };
            }
            return { ...video, progress: newProgress };
          }
          return video;
        });
      });
    }, intervalTime);
};

  const handleStatusChange = (videoTitle: string, newStatus: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed') => {
    if (newStatus === 'removed') {
      setVideos(prevVideos => prevVideos.filter(video => video.title !== videoTitle));
    } else {
      setVideos(prevVideos => {
        return prevVideos.map(video => {
          if (video.title === videoTitle) {
            return { ...video, status: newStatus };
          }
          return video;
        });
      });
    }
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
