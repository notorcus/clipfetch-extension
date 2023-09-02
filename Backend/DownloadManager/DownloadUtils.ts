// DownloadUtils.ts
import { spawn } from 'child_process';
import { getSetting } from './DownloadSettings';

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
    const outputPath = getSetting('output_path');
    const outputData = await downloadStream('video', outputPath, url);

    const downloadedFilePath = parseOutputData(outputData);
    if (downloadedFilePath) {
      console.log("Video downloaded successfully:", downloadedFilePath);
    }
  } catch (error) {
    console.error("Failed to download video:", error);
  }
};

const downloadAudio = async (url: string): Promise<void> => {
  try {
    const outputPath = getSetting('output_path');
    const outputData = await downloadStream('audio', outputPath, url);

    const downloadedFilePath = parseOutputData(outputData);
    if (downloadedFilePath) {
      console.log("Audio downloaded successfully:", downloadedFilePath);
    }
  } catch (error) {
    console.error("Failed to download audio:", error);
  }
};

const downloadCombined = (url: string): void => {
  // Implement download logic here
  downloadVideo(url);
  downloadAudio(url);
  console.log('Combining audio and video.');
};

const parseOutputData = (outputData: string): string | null => {
  const lines = outputData.split('\n');
  let downloadedFilePath: string | null = null;

  for (const line of lines) {
    if (line.startsWith('[download]')) {
      const destinationMatch = line.match(/Destination: (.+)$/);
      if (destinationMatch) {
        // Extract the file path that comes after "Destination:"
        downloadedFilePath = destinationMatch[1].trim();
      } else {
        // Extract the file path that starts after "[download] "
        downloadedFilePath = line.replace('[download] ', '').split(' has already been downloaded')[0].trim();
      }
      break;
    }
  }

  if (!downloadedFilePath) {
    console.error("Couldn't parse the filename from yt-dlp output.");
    return null;
  }

  return downloadedFilePath;
};

const checkNvencSupport = (): boolean => {
  // Implement NVENC support checking logic here
  console.log('Checking NVENC support.');
  return false;  // Placeholder
};

// Export the initiateDownload function
export { downloadVideo, downloadAudio, downloadCombined, checkNvencSupport };
