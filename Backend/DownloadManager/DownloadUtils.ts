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

const downloadVideo = async (url: string): Promise<string> => {
  try {
    const outputPath = getSetting('output_path');
    const outputData = await downloadStream('video', outputPath, url);
    const downloadedFilePath = parseOutputData(outputData);
    if (downloadedFilePath) {
      console.log("Video downloaded successfully:", downloadedFilePath);
      return downloadedFilePath;
    } else {
      throw new Error("Failed to get the video file path");
    }
  } catch (error) {
    console.error("Failed to download video:", error);
    throw error;
  }
};

const downloadAudio = async (url: string): Promise<string> => {
  try {
    const outputPath = getSetting('output_path');
    const outputData = await downloadStream('audio', outputPath, url);
    const downloadedFilePath = parseOutputData(outputData);
    if (downloadedFilePath) {
      console.log("Audio downloaded successfully:", downloadedFilePath);
      return downloadedFilePath;
    } else {
      throw new Error("Failed to get the audio file path");
    }
  } catch (error) {
    console.error("Failed to download audio:", error);
    throw error;
  }
};

const downloadCombined = async (url: string): Promise<void> => {
  try {
    // Get the output path from settings
    const outputPath = getSetting('output_path');
    
    // Download video and audio
    const videoFile = await downloadVideo(url);
    const audioFile = await downloadAudio(url);

    // Log for testing
    console.log(`Video File: ${videoFile}`);
    console.log(`Audio File: ${audioFile}`);

    // Merge video and audio
    const mergedFile = await mergeStreams(videoFile, audioFile, outputPath);

    // Log the path of the merged file
    console.log(`Merged File: ${mergedFile}`);

  } catch (error) {
    console.error('Error in downloadCombined:', error);
  }
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

const mergeStreams = (
  videoFile: string, 
  audioFile: string, 
  outputPath: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Extract title from videoFile using regex
    const titleMatch = videoFile.match(/([^\\]+)_(?:video|audio)\.\w+$/);
    if (!titleMatch) {
      reject(new Error("Couldn't parse the title from the video file path."));
      return;
    }
    const title = titleMatch[1];
    const mergedFilename = `${outputPath}${title}.mp4`;

    // For now, we'll assume NVENC support is true for faster development
    const supportsNvenc = true;  
    let args;
    
    const videoCodec = supportsNvenc ? 'h264_nvenc' : 'libx264';

    console.log(`Using ${videoCodec} for encoding.`);
    
    args = ['-y', '-i', videoFile, '-i', audioFile, '-c:v', videoCodec, '-preset', 'fast', '-c:a', 'aac', '-strict', 'experimental', '-f', 'mp4', mergedFilename];    

    const ffmpeg = spawn('ffmpeg', args);

    let errorData = '';
    ffmpeg.stderr.on('data', (data) => {
      errorData += data;
    });

    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        console.log("Error output:", errorData);
        reject(new Error(errorData));
      } else {
        resolve(mergedFilename);
      }
    });
  });
};

const checkNvencSupport = (): boolean => {
  // Implement NVENC support checking logic here
  console.log('Checking NVENC support.');
  return false;  // Placeholder
};

// Export the initiateDownload function
export { downloadVideo, downloadAudio, downloadCombined, checkNvencSupport };
