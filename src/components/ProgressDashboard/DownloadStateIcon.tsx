// DownloadStateIcon.tsx
import React, { useCallback } from 'react';
import './DownloadStateIcon.css';

interface DownloadStateIconProps {
  id: number;
  state: 'downloading' | 'completed' | 'failed' | 'cancelled' | 'removed';
  onCancel: (id: number) => void;
  onRemove?: (id: number) => void;
}

const DownloadStateIcon: React.FC<DownloadStateIconProps> = ({ id, state, onCancel, onRemove }) => {
  const handleIconClick = useCallback(() => {
    if (state === 'downloading' && onCancel) {
      onCancel(id);
    }
    if (state === 'completed' && onRemove) {
      onRemove(id);
    }
  }, [id, state, onCancel, onRemove]);

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
