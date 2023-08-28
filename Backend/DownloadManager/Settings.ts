// Define the structure for settings
interface DownloadSettings {
    output_path: string;
    combined: FileSettings;
    video_only: FileSettings;
    audio_only: AudioFileSettings;
  }
  
  interface FileSettings {
    enabled: boolean;
    codec: string;
    container: string;
    bitrate: string;
    dimensions: string;
  }
  
  interface AudioFileSettings {
    enabled: boolean;
    codec: string;
    container: string;
    bitrate: string;
  }
  
  // Default settings
  let downloadSettings: DownloadSettings = {
    output_path: './downloads/',
    combined: {
      enabled: true,
      codec: 'h264',
      container: 'mp4',
      bitrate: '4000k',
      dimensions: '1920x1080',
    },
    video_only: {
      enabled: false,
      codec: 'h264',
      container: 'mp4',
      bitrate: '4000k',
      dimensions: '1920x1080',
    },
    audio_only: {
      enabled: false,
      codec: 'aac',
      container: 'mp3',
      bitrate: '192k',
    },
  };
  
  // Getter for settings
  const getSetting = (key: keyof DownloadSettings): any => {
    return downloadSettings[key];
  };
  
  // Setter for settings
  const setSetting = (key: keyof DownloadSettings, value: any): void => {
    downloadSettings[key] = value;
  };
  
  // Function to update individual settings within nested objects
  const updateNestedSetting = (category: keyof DownloadSettings, key: string, value: any): void => {
    if (downloadSettings[category]) {
      (downloadSettings[category] as any)[key] = value;
    }
  };
  
  const toggleFileType = (fileType: 'combined' | 'video_only' | 'audio_only', enabled: boolean): void => {
    if (downloadSettings[fileType]) {
      downloadSettings[fileType].enabled = enabled;
    }
  };
  
  // Export the getters and setters
  export { getSetting, setSetting, updateNestedSetting, toggleFileType };
  