// ProgressDashboard.tsx
import React, { useState, useEffect } from 'react';
import DownloadCard from './DownloadCard';
import './DashboardStyles.css';

interface Video {
  title: string;
  progress: number;
  status: 'downloading' | 'completed' | 'failed'| 'cancelled';
}

interface ProgressDashboardProps {
  isOpen: boolean;
  externalVideos: Video[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ isOpen, externalVideos }) => {
  const [videos, setVideos] = useState<Video[]>(externalVideos); 

  useEffect(() => {
    console.log('Received new externalVideos:', externalVideos);
    setVideos(externalVideos);
  }, [externalVideos]);  

  useEffect(() => {
    console.log('Local videos state updated:', videos);
  }, [videos]);  

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
