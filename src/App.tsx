// App.tsx
import React, { useState } from 'react';
import './index.css';
import HomePage from './pages/HomePage/HomePage';
import SettingsPage from './pages/SettingsPage/SettingsPage'; // Uncommented this line

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'settings'>('home');

  const goToHomePage = () => setCurrentPage('home');
  const goToSettingsPage = () => setCurrentPage('settings');

  return (
    <div className="main-container">
      {currentPage === 'home' && <HomePage goToSettings={goToSettingsPage} />}
      {currentPage === 'settings' && <SettingsPage goToHome={goToHomePage} />} {/* Uncommented this line */}
      
      <div className="below-input-area">
        {/* Content goes here */}
      </div>
    </div>
  );
}

export default App;
