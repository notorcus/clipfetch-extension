// App.tsx
import './index.css';
import React, {useState} from 'react';
import HomePage from './pages/HomePage/HomePage';
import ProgressButton from './components/ProgressDashboard/ProgressButton';
import ProgressDashboard from './components/ProgressDashboard/ProgressDashboard';
import { DownloadSettingsProvider } from './DownloadSettingsContext';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <DownloadSettingsProvider>
      <div className="main-container">
        <HomePage />
        <div className="download-progress-container">
          <ProgressButton 
            onClick={() => setShowDashboard(prevState => !prevState)} 
            showDashboard={showDashboard}
          />
          <ProgressDashboard isOpen={showDashboard} />
        </div>
      </div>
    </DownloadSettingsProvider>
  );
}

export default App;
