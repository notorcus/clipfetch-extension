// DownloadUtils.ts
import { exec, spawn } from 'child_process';

const csInterface = new CSInterface();

export const getAvailableFormats = (url: string, callback: (error: any, videoData?: any, audioData?: any, videoTitle?: string, platform?: string) => void) => {
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
      const platform = parsedData.extractor_key || "Unknown Platform";
      const availableFormats = parsedData.formats || [];
    
      const formatsByResolution = groupFormatsByResolution(availableFormats);
      const bestFormatsByResolution = getBestVideoFormats(formatsByResolution);
    
      const audioFormats = availableFormats.filter((format: any) => format.acodec !== 'none');
      const bestAudioFormats = getBestAudioFormats(audioFormats);
    
      callback(null, bestFormatsByResolution, bestAudioFormats, videoTitle, platform);
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

  const bestFormatsByResolution: { [resolution: string]: string } = {};
  sortedResolutions.forEach(resolution => {
    const formats = formatsByResolution[resolution];
    formats.sort((a, b) => (b.vbr || 0) - (a.vbr || 0) || (b.fps || 0) - (a.fps || 0));
    bestFormatsByResolution[resolution] = formats[0].format_id;
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

export const downloadYTStream = (
  url: string, 
  formatId: string, 
  outputPath: string, 
  onProgress?: (progress: number) => void
): Promise<{absFilePath: string, fileName: string}> => {
  return new Promise((resolve, reject) => {
    let stderrData = '';
    let stdoutData = '';

    const fileName = `${generateRandomString(8)}.%(ext)s`;
    const tempFilePath = `${outputPath}/${fileName}`;

    const ytDlpDownload = spawn('yt-dlp', ['-f', formatId, url, '-o', tempFilePath, "--newline", '--progress-template', '"Downloading fragment: %(progress.fragment_index)s/%(progress.fragment_count)s"']);

    ytDlpDownload.stderr.on('data', (data) => {
      stderrData += data;
      console.log("yt-dlp stderr data:", data.toString());
    });

    let totalFragments = 0; // Stores the total number of fragments
    let lastLoggedFragment = -1; // Stores the last logged fragment to avoid duplicate logs
    
    ytDlpDownload.stdout.on('data', (data) => {
      const output = data.toString();
      console.log("Output:", output)
  
      // Extract total fragments
      const totalFragmentsMatch = output.match(/\[hlsnative\] Total fragments: (\d+)/);
      if (totalFragmentsMatch) {
        totalFragments = parseInt(totalFragmentsMatch[1], 10);
      }
  
      // Extract current downloading fragment
      const fragmentMatch = output.match(/Downloading fragment: (\d+)\/(\d+)/);
      if (fragmentMatch) {
        const currentFragment = parseInt(fragmentMatch[1], 10);
        
        if ((currentFragment - 1) === totalFragments) {
          return;
        }
  
        const percentage = (currentFragment / totalFragments) * 100;
  
        // To avoid logging the same fragment multiple times
        if (currentFragment !== lastLoggedFragment) {
          console.log(`Progress: ${percentage.toFixed(2)}% (Fragment ${currentFragment} of ${totalFragments})`);
          lastLoggedFragment = currentFragment;
  
          // Passing the percentage to the callback
          if (onProgress) {
            onProgress(percentage);
          }
        }
      }
    });

    ytDlpDownload.on('close', async (code) => {
      if (code === 0) {
        const ytDlpFilename = spawn('yt-dlp', ['--get-filename', '-f', formatId, url, '-o', tempFilePath]);
        
        ytDlpFilename.stdout.on('data', (data) => {
          stdoutData += data;
        });

        ytDlpFilename.on('close', (code) => {
          if (code === 0) {
            resolve({ absFilePath: stdoutData.trim(), fileName });
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

export const downloadDriveStream = (
  url: string, 
  formatId: string, 
  outputPath: string, 
  videoTitle: string | null = null,
  onProgress?: (progress: number) => void
): Promise<{absFilePath: string, fileName: string}> => {
  return new Promise((resolve, reject) => {
    let stderrData = '';

    const fileName = `${videoTitle}`;
    const filePath = `${outputPath}/${fileName}`;

    const ytDlpDownload = spawn('yt-dlp', ['-f', formatId, url, '-o', filePath, "--newline", '--progress-template', '"%(progress._default_template)s"']);

    ytDlpDownload.stderr.on('data', (data) => {
      stderrData += data;
      console.log("yt-dlp stderr data:", data.toString());
    });
    
    ytDlpDownload.stdout.on('data', (data) => {
      const output = data.toString();
    
      const progressMatch = output.match(/(\d+(\.\d+)?)%/);
      if (progressMatch && progressMatch[1]) {
        const progressValue = parseFloat(progressMatch[1]);
        if (onProgress) {
          onProgress(progressValue);
        }
      }
    });
    
    ytDlpDownload.on('close', (code) => {
      if (code === 0) {
        resolve({ absFilePath: filePath, fileName });
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

export const mergeStreams = (
  videoFile: string, 
  audioFile: string, 
  outputPath: string,
  title: string,
  onProgress?: (progress: number) => void  // Add this callback
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const mergedFilename = `${outputPath}/${title}.mp4`;

    const supportsNvenc = true;
    const videoCodec = supportsNvenc ? 'h264_nvenc' : 'libx264';

    console.log(`Using ${videoCodec} for encoding.`);

    const ffprobeArgs = [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-count_packets',
      '-show_entries', 'stream=nb_read_packets',
      '-of', 'csv=p=0',
      videoFile
    ];
    const ffprobe = spawn('ffprobe', ffprobeArgs);

    let frameData = '';
    ffprobe.stdout.on('data', (data) => {
      frameData += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        reject(new Error("Error getting total frames."));
        return;
      }

      const totalFrames = parseInt(frameData.trim(), 10);
      if (isNaN(totalFrames)) {
        reject(new Error("Couldn't parse total frames from ffprobe output."));
        return;
      }

      const args = ['-y', '-i', videoFile, '-i', audioFile, '-c:v', videoCodec, '-preset', 'fast', '-c:a', 'aac', '-strict', 'experimental', '-f', 'mp4', '-loglevel', 'info', mergedFilename];

      const ffmpeg = spawn('ffmpeg', args);

      let errorData = '';
      ffmpeg.stderr.on('data', (data) => {
        errorData += data;

        const logString = data.toString();
        if (logString.includes('frame=')) {
          const frameMatch = logString.match(/frame=\s*(\d+)/);
          if (frameMatch && frameMatch[1]) {
            const currentFrame = parseInt(frameMatch[1], 10);
            const percentageProcessed = (currentFrame / totalFrames) * 100;

            // Invoke the callback with the percentage processed
            if (onProgress) {
              onProgress(percentageProcessed);
            }
          }
        }
      });

      ffmpeg.on('close', (ffmpegCode) => {
        if (ffmpegCode !== 0) {
          reject(new Error(errorData));
        } else {
          resolve(mergedFilename);
        }
      });
    });
  });
};

export function deleteFile(filePath: string) {
  csInterface.evalScript(`$.runScript.deleteFile("${filePath.replace(/\\/g, '/')}")`, function(result: string) {
      if (result === 'true') {
          console.log("File deleted successfully");
      } else {
          console.log("Failed to delete file");
      }
  });
}

export function importFile(filePath: string) {
  csInterface.evalScript(`$.runScript.importFile("${filePath.replace(/\\/g, '/')}")`, function(result: string) {
  });
}

export const getVideoTitle = (url: string): Promise<string> => {
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

export const videoExists = (absoluteFilePath: string): boolean => {
  const stat = window.cep.fs.stat(absoluteFilePath);
  return stat.err === 0;
};


export function sanitizeFilename(filename: string): string {
  const disallowedChars = /[\/:*?"<>|]/g; 
  return filename.replace(disallowedChars, '_');  // Replace disallowed characters with underscores
}

export const findAvailableFilename = (outputPath: string, baseFilename: string, extension: string = '.mp4'): string => {
  let counter = 1;
  let newFilename = `${baseFilename}${extension}`;
  let fullOutputPath = `${outputPath}/${newFilename}`;
  
  
  while (videoExists(fullOutputPath)) {
    newFilename = `${baseFilename}_${counter}${extension}`;
    fullOutputPath = `${outputPath}/${newFilename}`;
    counter++;
  }
  
  return newFilename;
};