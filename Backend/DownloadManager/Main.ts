// Main.ts
import {
  downloadVideo,
  downloadAudio,
  downloadCombined,
  checkNvencSupport
} from './DownloadUtils';  // Adjust the path as needed
import { getSetting, updateNestedSetting } from './DownloadSettings';  // Adjust the path as needed

// Function to initiate downloads based on the settings
export const initiateDownload = (
  url: string, 
  isVideoActive: boolean, 
  isAudioActive: boolean, 
  isCombinedActive: boolean,
  callback: (error: any, data: any) => void
) => {
  // Update DownloadSettings based on the toggles
  updateNestedSetting('combined', 'enabled', isCombinedActive);
  updateNestedSetting('video_only', 'enabled', isVideoActive);
  updateNestedSetting('audio_only', 'enabled', isAudioActive);

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
    downloadCombined(url);
    if (!isVideoActive) {
      // Delete video file if it's not toggled on
      console.log('Deleting video file...');
    }
    if (!isAudioActive) {
      // Delete audio file if it's not toggled on
      console.log('Deleting audio file...');
    }
  }

  // If combined is not enabled, then proceed with individual downloads
  if (!isCombinedActive) {
    if (isVideoActive) {
      console.log('Initiating video download...');
      downloadVideo(url);
    }

    if (isAudioActive) {
      console.log('Initiating audio download...');
      downloadAudio(url);
    }
  }

  // You can also call the callback here to indicate success/failure
  // e.g., callback(null, "Download initiated");
};