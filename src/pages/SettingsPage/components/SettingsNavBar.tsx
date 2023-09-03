// SettingsNavBar.tsx
import React from 'react';
import './SettingsNavBar.css';

interface SettingsNavBarProps {
  pageName: string;
  goBack: () => void;
}

const SettingsNavBar: React.FC<SettingsNavBarProps> = ({ pageName, goBack }) => {
  return (
    <div className="settings-nav-bar">
      <button className="go-back-button" onClick={goBack}>
        Go Back
      </button>
      <div className="page-name">
        {pageName}
      </div>
    </div>
  );
};

export default SettingsNavBar;
