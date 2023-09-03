// Main.ts

import {
  downloadVideo,
  downloadAudio,
  downloadCombined,
  checkNvencSupport,
  deleteFile
} 

from './DownloadUtils';
import { getSetting, updateNestedSetting } from './DownloadSettings';

// Function to initiate downloads based on the settings
export const initiateDownload = async (
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

  // Download logic based on settings
  if (combinedSettings.enabled) {
    console.log('Combined settings:', combinedSettings);
    console.log('Initiating combined download...');

    // Awaiting the downloadCombined function
    const { mergedFile, videoFile, audioFile } = await downloadCombined(url);

    const correctedVideoFile = videoFile.replace(/\\/g, '/');
    const correctedAudioFile = audioFile.replace(/\\/g, '/');

    if (!isVideoActive) {
      console.log('Deleting video file...', correctedVideoFile);
      await deleteFile(correctedVideoFile);
      console.log("deleteFile called");
    }

    if (!isAudioActive) {
      console.log('Deleting audio file...', correctedAudioFile);
      await deleteFile(correctedAudioFile);
      console.log("deleteFile called");
    }
  }

  // If combined is not enabled, then proceed with individual downloads
  if (!isCombinedActive) {
    if (isVideoActive) {
      console.log('Video settings:', videoSettings);
      console.log('Initiating video download...');
      downloadVideo(url);
    }

    if (isAudioActive) {
      console.log('Audio settings:', audioSettings);
      console.log('Initiating audio download...');
      downloadAudio(url);
    }
  }
};