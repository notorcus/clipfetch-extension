// Main.ts
import { downloadYTStream, mergeStreams, deleteFile, importFile, getVideoTitle, videoExists, sanitizeFilename, findAvailableFilename, downloadDriveStream } from "./DownloadUtils";

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
  console.log("Initiating download...");

  let shouldOverwrite = true;  // Default overwrite decision to true

  try {
    const [videoTitle, videoFileData, audioFileData] = await Promise.all([
      getVideoTitle(inputValue),
      downloadYTStream(inputValue, videoFormatId, outputPath, (progress) => {
        if (onProgress) {
          onProgress(progress * 0.5); // 50% of total progress
        }
      }),
      downloadYTStream(inputValue, audioFormatId, outputPath)
    ]);

    console.log("Video path:", videoFileData.absFilePath);
    console.log("Audio path:", audioFileData.absFilePath);
    console.log("Video Title:", videoTitle);

    let mergedFilename = sanitizeFilename(videoTitle);

    shouldOverwrite = await new Promise((resolve) => {
      if (videoExists(`${outputPath}/${mergedFilename}.mp4`)) {
        const overwrite = window.confirm("A video with the same title already exists!\nDo you want to overwrite the existing video?");
        resolve(overwrite);
      } else {
        resolve(true);
      }
    });

    if (!shouldOverwrite) {
      console.log("mergedFilename:", mergedFilename);
      mergedFilename = findAvailableFilename(outputPath, mergedFilename);
    }

    const mergedFilePath = await mergeStreams(
      videoFileData.absFilePath,
      audioFileData.absFilePath,
      outputPath,
      mergedFilename.replace('.mp4', ''),
      (progress) => {
        if (onProgress) {
          onProgress(50 + progress * 0.5);
        }
      }
    );
    
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
    const videoTitle = await getVideoTitle(inputValue);
    
    // Remove the extension from the video title
    console.log("Drive file Title:", videoTitle);
  
    // Then download the video stream using the title without extension
    const videoFileData = await downloadDriveStream(
      inputValue, 
      videoFormatId, 
      outputPath, 
      videoTitle,
      (progress) => {  // This is the onProgress callback
        console.log(`Download progress: ${progress}%`);
      }
    );
  
    console.log("Video path:", videoFileData.absFilePath);
    importFile(videoFileData.absFilePath);
  } catch (error) {
    console.log("Error:", error);
  }
};