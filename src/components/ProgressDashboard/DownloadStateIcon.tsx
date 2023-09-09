// DownloadStateIcon.tsx
import React from 'react';
import './DownloadStateIcon.css';

interface DownloadStateIconProps {
  state: 'downloading' | 'completed' | 'failed' | 'cancelled';
  onCancel: () => void;
}

const DownloadStateIcon: React.FC<DownloadStateIconProps> = ({ state, onCancel }) => {
  const handleIconClick = () => {
    if (state === 'downloading' && onCancel) {
      onCancel();
    }
  };

  return (
    <div 
        className={`state-icon ${state}`}
        onClick={() => {
            if (state === 'downloading') {
            onCancel();
            }
        }}
    >
      {/* The actual icon will be set using CSS */}
    </div>
  );
}

export default DownloadStateIcon;
