import React from 'react';
import './LinkInput.css';  // Update your CSS file path if needed

interface LinkInputProps {
  onInputChange: (newValue: string) => void;
}

const LinkInput: React.FC<LinkInputProps> = ({ onInputChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

  return (
    <div className="link-input-container">
      <input 
        type="text" 
        className="link-input-field" 
        placeholder="Enter link..." 
        onChange={handleInputChange} // Update state on input change
      />
    </div>
  );
};

export default LinkInput;
