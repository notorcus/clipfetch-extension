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
  incomingVideos : Video[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ isOpen, incomingVideos  }) => {
  const [videos, setVideos] = useState<Video[]>([]); 

  useEffect(() => {
    const updatedVideos: Video[] = incomingVideos.map(incomingVideo => {
      const existingVideo = videos.find(video => video.title === incomingVideo.title);
  
      if (existingVideo) {

        if (incomingVideo.progress >= 100) {
          return { ...existingVideo, progress: 100, status: 'completed' as const };
        }

        return { ...existingVideo, ...incomingVideo };
      }

      if (incomingVideo.progress >= 100) {
        return { ...incomingVideo, status: 'completed' as const };
      }

      return incomingVideo;
    });
  
    setVideos(updatedVideos);
  }, [incomingVideos]);
  

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
