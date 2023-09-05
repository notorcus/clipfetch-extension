// Main.ts
import { downloadStream } from "./DownloadUtils";

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
  } catch (error) {
    console.log("Error:", error);
  }
};

