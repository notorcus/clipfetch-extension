// Main.ts
import { downloadStream, mergeStreams, deleteFile, importFile, getVideoTitle } from "./DownloadUtils";

export const downloadYT = async (
  inputValue: string,
  videoFormatId: string,
  audioFormatId: string,
  outputPath: string,
  onProgress?: (progress: number) => void
) => {
  if (inputValue === '') {
    console.log("Input field is empty.");
    return;
  }
  // console.log("Download button clicked. Input value:", inputValue);
  console.log("Initiating download...");

  try {
    const [videoTitle, videoFileData, audioFileData] = await Promise.all([
      getVideoTitle(inputValue),
      downloadStream(inputValue, videoFormatId, outputPath, null, onProgress),
      downloadStream(inputValue, audioFormatId, outputPath)
    ]);
    
    console.log("Video path:", videoFileData.absFilePath);
    console.log("Audio path:", audioFileData.absFilePath);
    console.log("Video Title:", videoTitle)

    // Merge the video and audio streams
    const mergedFilePath = await mergeStreams(
      videoFileData.absFilePath,
      audioFileData.absFilePath,
      outputPath,
      videoTitle.replace(/\//g, '')
    );
    
    // Replace all backslashes with forward slashes
    console.log("Merged file path:", mergedFilePath);

    // Delete the temporary video and audio files
    importFile(mergedFilePath);
    deleteFile(videoFileData.absFilePath);
    deleteFile(audioFileData.absFilePath);
  } catch (error) {
    console.log("Error:", error);
  }
};

export const downloadDrive = async (inputValue: string, videoFormatId: string, outputPath: string) => {
  if (inputValue === '') {
    console.log("Input field is empty.");
    return;
  }

  console.log("Initiating download from drive...");

  try {
    // Get the video title first
    const videoTitle = await getVideoTitle(inputValue);
    
    // Remove the extension from the video title
    const lastDotIndex = videoTitle.lastIndexOf('.');
    const titleWithoutExtension = (lastDotIndex !== -1) ? videoTitle.substring(0, lastDotIndex) : videoTitle;
    
    console.log("Video Title:", titleWithoutExtension);
  
    // Then download the video stream using the title without extension
    const videoFileData = await downloadStream(inputValue, videoFormatId, outputPath, titleWithoutExtension);
  
    console.log("Video path:", videoFileData.absFilePath);
    
    // Delete the temporary video and audio files
    importFile(videoFileData.absFilePath);
  } catch (error) {
    console.log("Error:", error);
  }
};
