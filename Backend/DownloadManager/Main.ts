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
    const videoPrompt = await downloadStream(inputValue, videoFormatId, outputPath);
    console.log("Video download prompt:", videoPrompt);

    const audioPrompt = await downloadStream(inputValue, audioFormatId, outputPath);
    console.log("Audio download prompt:", audioPrompt);
  } catch (error) {
    console.log("Error:", error);
  }
};
