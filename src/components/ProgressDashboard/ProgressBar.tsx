// ProgressBar.tsx
import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // console.log(`ProgressBar rendering with progress: ${progress}`);
  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

export default ProgressBar;
