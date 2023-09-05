// App.tsx
import './index.css';
import HomePage from './pages/HomePage/HomePage';
import { DownloadSettingsProvider } from './DownloadSettingsContext';

function App() {
  return (
    <DownloadSettingsProvider>
      <div className="main-container">
        <HomePage />
        <div className="below-input-area">
        </div>
      </div>
    </DownloadSettingsProvider>
  );
}

export default App;
