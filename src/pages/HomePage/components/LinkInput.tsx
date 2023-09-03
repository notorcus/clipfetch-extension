// LinkInput.tsx
import React from 'react';
import './LinkInput.css';
import { getAvailableFormats } from '../../../../backend/DownloadManager/DownloadUtils';  // Update the path as needed

interface LinkInputProps {
  onInputChange: (newValue: string) => void;
}

const LinkInput: React.FC<LinkInputProps> = ({ onInputChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onInputChange(newValue);
  
    // Fetch available formats if the input is not empty
    if (newValue !== '') {
      getAvailableFormats(newValue, (error, data) => {
        if (error) {
          console.error("Could not get available formats:", error);
        } else {
          console.log("Available formats:", data);
          // Here, you can update some state to populate the dropdown options
        }
      });
    }
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
