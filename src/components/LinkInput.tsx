import React from 'react';
import './LinkInput.css';

const LinkInput: React.FC = () => {
  return (
    <div className="link-input-container">
      <input type="text" className="link-input-field" placeholder="Enter link..." />
    </div>
  );
};

export default LinkInput;
