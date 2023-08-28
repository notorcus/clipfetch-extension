// Default settings
let downloadSettings = {
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
const getSetting = (key) => {
    return downloadSettings[key];
};

// Setter for settings
const setSetting = (key, value) => {
    downloadSettings[key] = value;
};

// Function to update individual settings within nested objects
const updateNestedSetting = (category, key, value) => {
    if (downloadSettings[category]) {
        downloadSettings[category][key] = value;
    }
};

const toggleFileType = (fileType, enabled) => {
    if (downloadSettings[fileType]) {
        downloadSettings[fileType].enabled = enabled;
    }
};

// Export the getters and setters
module.exports = { getSetting, setSetting, updateNestedSetting, toggleFileType };
  