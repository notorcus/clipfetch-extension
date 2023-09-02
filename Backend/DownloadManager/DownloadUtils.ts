// DownloadUtils.ts
import { spawn } from 'child_process';

const downloadStream = (format: 'video' | 'audio', outputPath: string, link: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ytDlpPath = "C:\\Users\\Akshat Kumar\\AppData\\Roaming\\Python\\Python311\\Scripts\\yt-dlp.exe";
    const filename = `${outputPath}%(title)s_${format}.%(ext)s`;

    let args: string[];
    if (format === 'video') {
      args = ['-f', 'bestvideo[acodec=none]', '-o', filename, link];
    } else {
      args = ['-f', 'bestaudio[vcodec=none]', '-o', filename, link];
    }

    const ytDlp = spawn(ytDlpPath, args);

    let errorData = '';
    let outputData = '';

    ytDlp.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    ytDlp.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    ytDlp.on('close', (code) => {
      if (code !== 0) {
        console.error("Error output:", errorData);
        reject(new Error(errorData));
      } else {
        // Logic to parse the output will go here
        resolve(outputData);
      }
    });
  });
};

const downloadVideo = async (url: string): Promise<void> => {
  try {
    const outputPath = 'C:\\Users\\Akshat Kumar\\Editing\\Media\\PProClipFetch\\';
    const outputData = await downloadStream('video', outputPath, url);
    console.log("Video downloaded successfully:", outputData);
  } catch (error) {
    console.error("Failed to download video:", error);
  }
};

const downloadAudio = async (url: string): Promise<void> => {
  try {
    const outputPath = 'C:\\Users\\Akshat Kumar\\Editing\\Media\\PProClipFetch\\';
    const outputData = await downloadStream('audio', outputPath, url);
    console.log("Audio downloaded successfully:", outputData);
  } catch (error) {
    console.error("Failed to download audio:", error);
  }
}

const downloadCombined = (url: string): void => {
  // Implement download logic here
  downloadVideo(url);
  downloadAudio(url);
  console.log('Combining audio and video.');
};

const checkNvencSupport = (): boolean => {
  // Implement NVENC support checking logic here
  console.log('Checking NVENC support.');
  return false;  // Placeholder
};

// Export the initiateDownload function
export { downloadVideo, downloadAudio, downloadCombined, checkNvencSupport };
