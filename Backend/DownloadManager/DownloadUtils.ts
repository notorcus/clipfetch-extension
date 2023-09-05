// DownloadUtils.ts
import { spawn } from 'child_process';

const csInterface = new CSInterface();

const getAvailableFormats = (url: string, callback: (error: any, videoData?: any, audioData?: any, videoTitle?: string) => void) => {
  const ytDlp = spawn('yt-dlp', ['--dump-json', url]);
  let output = '';
  let errorOutput = '';

  ytDlp.stdout.on('data', (data) => {
    output += data;
  });

  ytDlp.stderr.on('data', (data) => {
    errorOutput += data;
  });

  ytDlp.on('close', (code) => {
    if (code !== 0) {
      return callback(new Error(`yt-dlp failed: ${errorOutput}`));
    }

    try {
      const parsedData = JSON.parse(output);
      const videoTitle = parsedData.title || "Unknown Title";
      const availableFormats = parsedData.formats || [];
    
      const formatsByResolution = groupFormatsByResolution(availableFormats);
      const bestFormatsByResolution = getBestVideoFormats(formatsByResolution);
    
      const audioFormats = availableFormats.filter((format: any) => format.acodec !== 'none');
      const bestAudioFormats = getBestAudioFormats(audioFormats);
    
      callback(null, bestFormatsByResolution, bestAudioFormats, videoTitle);
    } catch (err) {
      callback(err);
    }
  });
};

const groupFormatsByResolution = (formats: any[]) => {
  const formatsByResolution: { [resolution: string]: any[] } = {};
  formats.forEach((format: any) => {
    if (format.vcodec !== 'none') {
      const resolution = format.resolution || `${format.width}x${format.height}`;
      if (!formatsByResolution[resolution]) {
        formatsByResolution[resolution] = [];
      }
      formatsByResolution[resolution].push(format);
    }
  });
  return formatsByResolution;
};

const getBestVideoFormats = (formatsByResolution: { [resolution: string]: any[] }) => {
  const sortedResolutions = Object.keys(formatsByResolution).sort((a, b) => {
    const [widthA] = a.split('x').map(Number);
    const [widthB] = b.split('x').map(Number);
    return widthB - widthA;
  });

  const bestFormatsByResolution: { [resolution: string]: any } = {};
  sortedResolutions.forEach(resolution => {
    const formats = formatsByResolution[resolution];
    formats.sort((a, b) => (b.vbr || 0) - (a.vbr || 0) || (b.fps || 0) - (a.fps || 0));
    bestFormatsByResolution[resolution] = formats[0];
    // console.log(`Resolution: ${resolution}, Best format ID: ${formats[0].format_id}`);
  });

  return bestFormatsByResolution;
};

const getBestAudioFormats = (audioFormats: any[]) => {
  const bestAudioFormats: { [friendlyName: string]: string } = {};

  // Filter out formats with 0kbps and sort from high to low
  const filteredAndSortedAudioFormats = audioFormats
    .filter((format) => Math.round(format.abr) > 0)
    .sort((a, b) => Math.round(b.abr) - Math.round(a.abr));

  // Remove redundant formats and populate bestAudioFormats
  const uniqueBitRates = new Set();
  filteredAndSortedAudioFormats.forEach((format) => {
    const roundedAbr = Math.round(format.abr);
    if (!uniqueBitRates.has(roundedAbr)) {
      uniqueBitRates.add(roundedAbr);
      const friendlyName = `${roundedAbr}kbps`;
      bestAudioFormats[friendlyName] = format.format_id;
      // console.log(`Friendly name: ${friendlyName}, Format ID: ${format.format_id}`); 
    }
  });
  return bestAudioFormats;
};

const downloadStream = (url: string, formatId: string, outputPath: string): Promise<{absFilePath: string, fileName: string}> => {
  return new Promise((resolve, reject) => {
    // Variables to accumulate stderr data and stdout data for filename
    let stderrData = '';
    let stdoutData = '';

    // Generate a unique ID and filename
    const uniqueID = generateRandomString(8);  // 8-character long random string
    const fileName = `${uniqueID}.%(ext)s`;
    const tempFilePath = `${outputPath}/${fileName}`;

    const ytDlpDownload = spawn('yt-dlp', ['-f', formatId, url, '-o', tempFilePath]);

    ytDlpDownload.stderr.on('data', (data) => {
      stderrData += data;
    });

    ytDlpDownload.on('close', async (code) => {
      if (code === 0) {
        // After successful download, fetch the absolute filename
        const ytDlpFilename = spawn('yt-dlp', ['--get-filename', '-f', formatId, url, '-o', tempFilePath]);
        
        ytDlpFilename.stdout.on('data', (data) => {
          stdoutData += data;
        });

        ytDlpFilename.on('close', (code) => {
          if (code === 0) {
            resolve({ absFilePath: stdoutData.trim(), fileName });  // Return the absolute file path and fileName
          } else {
            reject(`yt-dlp process for filename exited with code ${code}`);
          }
        });
      } else {
        console.error(`Full stderr: ${stderrData}`);
        reject(`yt-dlp process exited with code ${code}`);
      }
    });
  });
};


function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const mergeStreams = (
  videoFile: string, 
  audioFile: string, 
  outputPath: string,
  title: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const mergedFilename = `${outputPath}/${title}.mp4`;

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

 function deleteFile(filePath: string) {
  csInterface.evalScript(`$.runScript.deleteFile("${filePath.replace(/\\/g, '/')}")`, function(result: string) {
      if (result === 'true') {
          console.log("File deleted successfully");
      } else {
          console.log("Failed to delete file");
      }
  });
}

function importFile(filePath: string) {
  csInterface.evalScript(`$.runScript.importFile("${filePath.replace(/\\/g, '/')}")`, function(result: string) {
  });
}

const getVideoTitle = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let titleData = '';
    const ytDlpTitle = spawn('yt-dlp', ['--get-title', url]);

    ytDlpTitle.stdout.on('data', (data) => {
      titleData += data;
    });

    ytDlpTitle.on('close', (code) => {
      if (code === 0) {
        resolve(titleData.trim());  // Return the video title
      } else {
        reject(`yt-dlp process exited with code ${code}`);
      }
    });
  });
};


export { getAvailableFormats, downloadStream, mergeStreams, deleteFile, importFile, getVideoTitle }