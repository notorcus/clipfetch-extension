// LinkInput.tsx
import React from 'react';
import './LinkInput.css';

interface LinkInputProps {
  onInputChange: (newValue: string) => void;
}

const LinkInput: React.FC<LinkInputProps> = ({ onInputChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onInputChange(newValue);
  };

  return (
    <div className="link-input-container">
      <input 
        type="text" 
        className="link-input-field" 
        placeholder="Enter link..." 
        onChange={handleInputChange}
      />
    </div>
  );
};

export default LinkInput;
