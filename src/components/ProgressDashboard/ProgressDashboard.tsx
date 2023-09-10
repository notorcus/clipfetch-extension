// ProgressDashboard.tsx
import React, { useState, useEffect } from 'react';
import DownloadCard from './DownloadCard';
import './DashboardStyles.css';
import { Video } from '../../../types/videoTypes'

interface ProgressDashboardProps {
  isOpen: boolean;
  incomingVideos : Video[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ isOpen, incomingVideos  }) => {
  const [videos, setVideos] = useState<Video[]>([]); 

  useEffect(() => {
    const updatedVideos: Video[] = incomingVideos.map(incomingVideo => {
      const existingVideo = videos.find(video => video.id === incomingVideo.id); // changed from title to id
  
      if (existingVideo) {
        if (incomingVideo.progress >= 100) {
          return { ...existingVideo, progress: 100, status: 'completed' as const };
        }
  
        return { 
          ...existingVideo, 
          progress: incomingVideo.progress, 
          // add any other fields from incomingVideo that you want to update
        };
      }
  
      if (incomingVideo.progress >= 100) {
        return { ...incomingVideo, status: 'completed' as const };
      }
  
      return incomingVideo;
    });
  
    setVideos(updatedVideos);
  }, [incomingVideos]);  
  

  const handleStatusChange = (videoId: number, newStatus: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed') => {
    console.log(`handleStatusChange called with id: ${videoId} and status: ${newStatus}`);
    
    if (newStatus === 'removed') {
      console.log(`Request to remove video with id: ${videoId}`);
      // Do not remove the video, just log the request
    } else {
      setVideos(prevVideos => {
        return prevVideos.map(video => {
          if (video.id === videoId) {
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
          key={video.id}
          video={video} 
          onStatusChange={(videoId, newStatus) => handleStatusChange(videoId, newStatus)}
        />
      ))}
    </div>
  );  
}


export default ProgressDashboard;
