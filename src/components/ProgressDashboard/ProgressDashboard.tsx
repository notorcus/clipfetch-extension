// ProgressDashboard.tsx
import React, { useState, useEffect } from 'react';
import VideoListItem from './FileDownloadCard';
import './dashboardStyles.css';

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

  useEffect(() => {
    console.log(`ProgressDashboard received command to: ${isOpen ? "Open" : "Close"}`);
  }, [isOpen]);

  return (
    <div className={`progress-dashboard ${isOpen ? "visible" : "hidden"}`}>
      Progress Dashboard
    </div>
  );  
}

export default ProgressDashboard;