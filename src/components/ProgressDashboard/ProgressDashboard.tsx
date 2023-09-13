// ProgressDashboard.tsx
import React, { useState, useEffect } from 'react';
import DownloadCard from './DownloadCard';
import './DashboardStyles.css';
import { Video } from '../../../types/videoTypes'

interface ProgressDashboardProps {
  isOpen: boolean;
  incomingVideos : Video[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ isOpen, incomingVideos }) => {
  const [videos, setVideos] = useState<Video[]>([]); 
  const [removedVideoIds, setRemovedVideoIds] = useState<number[]>([]);

  useEffect(() => {
    const updatedVideos: Video[] = incomingVideos
      .filter(incomingVideo => incomingVideo.status !== 'removed' && !removedVideoIds.includes(incomingVideo.id))
      .map(incomingVideo => {
        const existingVideo = videos.find(video => video.id === incomingVideo.id);

        if (existingVideo) {
          if (incomingVideo.progress >= 100) {
            return { ...existingVideo, progress: 100, status: 'completed' as const };
          }

          return { 
            ...existingVideo, 
            progress: incomingVideo.progress,
          };
        }

        if (incomingVideo.progress >= 100) {
          return { ...incomingVideo, status: 'completed' as const };
        }

        return incomingVideo;
      });

      console.log("Updated Videos", updatedVideos)
      setVideos(updatedVideos);
  }, [incomingVideos, removedVideoIds]);

  const handleStatusChange = (videoId: number, newStatus: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed') => {
    console.log(`handleStatusChange called with id: ${videoId} and status: ${newStatus}`);

    if (newStatus === 'removed') {
      console.log(`Request to remove video with id: ${videoId}`);
      setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
      setRemovedVideoIds(prevIds => [...prevIds, videoId]);
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
