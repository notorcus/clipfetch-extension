// Main.ts
import { downloadStream, mergeStreams, deleteFile, importFile, getVideoTitle } from "./DownloadUtils";

export const initiateDownload = async (inputValue: string, videoFormatId: string, audioFormatId: string, outputPath: string) => {
  if (inputValue === '') {
    console.log("Input field is empty.");
    return;
  }
  console.log("Download button clicked. Input value:", inputValue);

  console.log("Initiating download...");

  try {
    const [videoTitle, videoFileData, audioFileData] = await Promise.all([
      getVideoTitle(inputValue),
      downloadStream(inputValue, videoFormatId, outputPath),
      downloadStream(inputValue, audioFormatId, outputPath),
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
