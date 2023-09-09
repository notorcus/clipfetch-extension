// DownloadStateIcon.tsx
import React from 'react';
import './DownloadStateIcon.css';

interface DownloadStateIconProps {
  state: 'downloading' | 'completed' | 'failed';
  onCancel?: () => void;  // Callback for when the icon is clicked during the 'downloading' state
}

const DownloadStateIcon: React.FC<DownloadStateIconProps> = ({ state, onCancel }) => {
  const handleIconClick = () => {
    if (state === 'downloading' && onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`state-icon ${state}`} onClick={handleIconClick}>
      {/* The actual icon will be set using CSS */}
    </div>
  );
}

export default DownloadStateIcon;
