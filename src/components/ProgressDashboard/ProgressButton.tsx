// ProgressButton.tsx
import React from 'react';
import './dashboardStyles.css';

interface ProgressButtonProps {
  onClick: () => void;
  showDashboard: boolean;
}

const ProgressButton: React.FC<ProgressButtonProps> = ({ onClick, showDashboard }) => {
  const handleClick = () => {
    console.log(`ProgressButton: ${showDashboard ? "Closing" : "Opening"} ProgressDashboard.`);
    onClick();
  };

  return (
    <button 
      onClick={handleClick} 
      className={`progress-btn ${showDashboard ? "active" : ""}`}
    >
      {showDashboard ? "Hide Progress" : "Show Progress"}
    </button>
  );
}

export default ProgressButton;
