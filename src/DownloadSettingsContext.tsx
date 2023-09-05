// DownloadSettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type DownloadSettingsType = { 
  outputPath: string;
};

const defaultSettings: DownloadSettingsType = { 
  outputPath: 'C:\\Users\\Akshat Kumar\\Editing\\Media\\PProClipFetch\\'
};

export const DownloadSettingsContext = createContext<[DownloadSettingsType, (newSettings: DownloadSettingsType) => void]>([defaultSettings, () => {}]);

export const DownloadSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloadSettings, setDownloadSettings] = useState(() => {
    const savedSettings = localStorage.getItem('downloadSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('downloadSettings', JSON.stringify(downloadSettings));
  }, [downloadSettings]);

  return (
    <DownloadSettingsContext.Provider value={[downloadSettings, setDownloadSettings]}>
      {children}
    </DownloadSettingsContext.Provider>
  );
};

export const useDownloadSettings = () => {
  return useContext(DownloadSettingsContext);
};