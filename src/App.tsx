// App.tsx
import './index.css';
import React, {useState} from 'react';
import HomePage from './pages/HomePage/HomePage';
import ProgressButton from './components/ProgressDashboard/ProgressButton';
import ProgressDashboard from './components/ProgressDashboard/ProgressDashboard';
import { DownloadSettingsProvider } from './DownloadSettingsContext';
import { Video } from '../types/videoTypes';


function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);

  const handleProgressUpdate = (id: number, progress: number) => {
    setVideos(prevVideos => prevVideos.map(video => video.id === id ? { ...video, progress } : video));
  };

  const handleNewVideoDownload = (id: number, title: string) => {
    const newVideo: Video = {
      id,
      title,
      progress: 0,
      status: 'downloading'
    };
    setVideos(prevVideos => [...prevVideos, newVideo]);
  };  

  return (
    <DownloadSettingsProvider>
      <div className="main-container">
        <HomePage 
          onProgressUpdate={handleProgressUpdate}
          onNewVideoDownload={handleNewVideoDownload}
        />
        <div className="download-progress-container">
          <ProgressButton 
            onClick={() => setShowDashboard(prevState => !prevState)} 
            showDashboard={showDashboard}
          />
          <ProgressDashboard isOpen={showDashboard} incomingVideos={videos} />
        </div>
      </div>
    </DownloadSettingsProvider>
  );
}

export default App;