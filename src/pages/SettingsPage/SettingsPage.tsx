// SettingsPage.tsx
import React from 'react';

interface SettingsPageProps {
  goToHome: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ goToHome }) => {
  return (
    <div>
      <h1>Settings Page</h1>
      <button onClick={goToHome}>Go Back to Home</button>
    </div>
  );
};

export default SettingsPage;
