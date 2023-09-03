// SettingsPage.tsx
import React from 'react';
import SettingsNavBar from './components/SettingsNavBar'; // Import the new component

interface SettingsPageProps {
  goToHome: () => void;
  pageName: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ goToHome, pageName }) => {
  return (
    <div>
      <SettingsNavBar pageName={pageName} goBack={goToHome} />
    </div>
  );
};

export default SettingsPage;
