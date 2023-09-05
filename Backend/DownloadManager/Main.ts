// Main.ts
import { downloadStream, mergeStreams } from "./DownloadUtils";

export const initiateDownload = async (inputValue: string, videoFormatId: string, audioFormatId: string, outputPath: string) => {
  if (inputValue === '') {
    console.log("Input field is empty.");
    return;
  }
  console.log("Download button clicked. Input value:", inputValue);

  console.log("Initiating download...");

  try {
    const [videoFilePath, audioFilePath] = await Promise.all([
      downloadStream(inputValue, videoFormatId, outputPath),
      downloadStream(inputValue, audioFormatId, outputPath),
    ]);

    console.log("Video path:", videoFilePath);
    console.log("Audio path:", audioFilePath);

    const titleMatch = videoFilePath.match(/([^\\]+)\(temp\)\.\w+$/);
    if (!titleMatch) {
      console.log("Couldn't parse the title from the video file path.");
      return;
    }
    const title = titleMatch[1];

    // Merge the video and audio streams
    const mergedFilePath = await mergeStreams(
      videoFilePath,
      audioFilePath,
      outputPath,
      title
    );
    console.log("Merged file path:", mergedFilePath);
  } catch (error) {
    console.log("Error:", error);
  }
};
