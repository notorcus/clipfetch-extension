// DownloadUtils.ts
import { spawn } from 'child_process';

export const getAvailableFormats = (url: string, callback: (error: any, videoData?: any, audioData?: any, videoTitle?: string) => void) => {
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

export const downloadStream = (url: string, formatId: string, outputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Variables to accumulate stdout and stderr data
    let stdoutData = '';
    let stderrData = '';

    // First, download the video
    const ytDlpDownload = spawn('yt-dlp', ['-f', formatId, url, '-o', `${outputPath}\\%(title)s.%(ext)s`]);

    ytDlpDownload.stdout.on('data', (data) => {
      stdoutData += data;
    });

    ytDlpDownload.stderr.on('data', (data) => {
      stderrData += data;
    });

    ytDlpDownload.on('close', (code) => {
      if (code === 0) {
        console.log(`Full stdout: ${stdoutData}`);

        // Now get the filename
        const ytDlpFilename = spawn('yt-dlp', ['--get-filename', '-f', formatId, url, '-o', `${outputPath}\\%(title)s.%(ext)s`]);
        let filename = '';

        ytDlpFilename.stdout.on('data', (data) => {
          filename += data;
        });

        ytDlpFilename.on('close', (code) => {
          if (code === 0) {
            resolve(filename.trim());  // Return the filename
          } else {
            reject(`yt-dlp process exited with code ${code}`);
          }
        });

      } else {
        console.error(`Full stderr: ${stderrData}`);
        reject(`yt-dlp process exited with code ${code}`);
      }
    });
  });
};