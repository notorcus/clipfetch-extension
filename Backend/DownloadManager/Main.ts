// Main.ts
import { downloadStream } from "./DownloadUtils";

const initiateDownload = async (inputValue: string, videoFormatId: string, audioFormatId: string) => {
    if (inputValue === '') {
      console.log("Input field is empty.");
      return;
    }
    console.log("Download button clicked. Input value:", inputValue);
    // Dummy function to simulate the download initiating.
    console.log("Initiating download...");
  
    try {
      const videoPrompt = await downloadStream(inputValue, videoFormatId);
      console.log("Video download prompt:", videoPrompt);
  
      const audioPrompt = await downloadStream(inputValue, audioFormatId);
      console.log("Audio download prompt:", audioPrompt);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
export { initiateDownload };