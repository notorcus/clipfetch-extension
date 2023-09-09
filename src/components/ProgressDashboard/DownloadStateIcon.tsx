// DownloadStateIcon.tsx
import React from 'react';
import './DownloadStateIcon.css';

interface DownloadStateIconProps {
  state: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed';
  onCancel: () => void;
  onRemove?: () => void;
}

const DownloadStateIcon: React.FC<DownloadStateIconProps> = ({ state, onCancel, onRemove }) => {
  const handleIconClick = () => {
    if (state === 'downloading' && onCancel) {
      onCancel();
    }
    if (state === 'completed' && onRemove) {
      onRemove();
    }
  };

  return (
    <div 
        className={`state-icon ${state}`}
        onClick={handleIconClick}
    >
      {/* The actual icon will be set using CSS */}
    </div>
  );
}

export default DownloadStateIcon;
