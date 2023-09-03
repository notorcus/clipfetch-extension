// App.tsx
import React, { useState } from 'react';
import './index.css';
import HomePage from './pages/HomePage/HomePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'settings'>('home');
  const [currentSettingsPage, setCurrentSettingsPage] = useState<string>('');

  const goToHomePage = () => setCurrentPage('home');
  const goToSettingsPage = (pageName: string) => {
    setCurrentSettingsPage(pageName);
    setCurrentPage('settings');
  };

  return (
    <div className="main-container">
      {currentPage === 'home' && <HomePage goToSettingsPage={goToSettingsPage} />}
      {currentPage === 'settings' && <SettingsPage goToHome={goToHomePage} pageName={currentSettingsPage} />}
    </div>
  );
}

export default App;
