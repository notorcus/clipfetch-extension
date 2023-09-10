// App.tsx
import './index.css';
import React, {useState} from 'react';
import HomePage from './pages/HomePage/HomePage';
import ProgressButton from './components/ProgressDashboard/ProgressButton';
import ProgressDashboard from './components/ProgressDashboard/ProgressDashboard';
import { DownloadSettingsProvider } from './DownloadSettingsContext';

interface Video {
  title: string;
  progress: number;
  status: 'downloading' | 'completed' | 'failed';
}

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);

  const handleProgressUpdate = (title: string, progress: number) => {
    setVideos(prevVideos => prevVideos.map(video => video.title === title ? { ...video, progress } : video));
  };

  const handleNewVideoDownload = (title: string) => {
    setVideos(prevVideos => [...prevVideos, { title, progress: 0, status: 'downloading' }]);
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