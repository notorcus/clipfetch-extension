import {
    downloadVideo,
    downloadAudio,
    downloadCombined,
    checkNvencSupport
  } from './DownloadUtils';  // Adjust the path as needed
  import { getSetting } from './DownloadSettings';  // Adjust the path as needed
  
  // Main application logic
  const main = () => {
  
    // Check for NVENC support
    const nvencSupported = checkNvencSupport();
    console.log(`NVENC support: ${nvencSupported}`);
  
    // Get the current settings
    const combinedSettings = getSetting('combined');
    const videoSettings = getSetting('video_only');
    const audioSettings = getSetting('audio_only');
  
    // Log for testing
    console.log('Combined settings:', combinedSettings);
    console.log('Video settings:', videoSettings);
    console.log('Audio settings:', audioSettings);
  
    // Download logic based on settings
    if (combinedSettings.enabled) {
      console.log('Initiating combined download...');
      downloadCombined(combinedSettings);
    }
  
    if (videoSettings.enabled) {
      console.log('Initiating video download...');
      downloadVideo(videoSettings);
    }
  
    if (audioSettings.enabled) {
      console.log('Initiating audio download...');
      downloadAudio(audioSettings);
    }
  };
  
  // Execute main application logic
  main();
  