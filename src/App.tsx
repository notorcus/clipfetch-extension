// App.tsx
import React, { useState } from 'react';
import './index.css';
import HomePage from './pages/HomePage/HomePage';
// import SettingsPage from './pages/SettingsPage/SettingsPage'; // Uncomment this once you create the SettingsPage component

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'settings'>('home');

  const goToHomePage = () => setCurrentPage('home');
  const goToSettingsPage = () => setCurrentPage('settings');

  return (
    <div className="main-container">
      {currentPage === 'home' && <HomePage goToSettings={goToSettingsPage} />}
      {/* Uncomment the line below once you create the SettingsPage component */}
      {/* {currentPage === 'settings' && <SettingsPage goToHome={goToHomePage} />} */}
      
      <div className="below-input-area">
        {/* Content goes here */}
      </div>
    </div>
  );
}

export default App;
