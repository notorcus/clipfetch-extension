// DownloadUtils.ts
import { spawn } from 'child_process';

export const getAvailableFormats = (url: string, callback: (error: any, videoData?: any, audioData?: any) => void) => {
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
      const availableFormats = parsedData.formats || [];

      const formatsByResolution: { [resolution: string]: any[] } = {};
      const audioFormats: any[] = [];
      availableFormats.forEach((format: any) => {
        if (format.vcodec !== 'none') {
          const resolution = format.resolution || `${format.width}x${format.height}`;
          if (!formatsByResolution[resolution]) {
            formatsByResolution[resolution] = [];
          }
          formatsByResolution[resolution].push(format);
        } else if (format.acodec !== 'none') {
          audioFormats.push(format);
        }
      });

      // Sort and filter video formats
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
      });

      // Filter and sort audio formats
      const uniqueAudioFormats = Array.from(new Set(audioFormats.map(format => Math.round(format.abr))));
      uniqueAudioFormats.sort((a, b) => b - a);
      const bestAudioFormats = uniqueAudioFormats.map(abr => ({
        abr,
        friendlyName: `${abr}kbps`,
      }));

      callback(null, bestFormatsByResolution, bestAudioFormats);

    } catch (err) {
      callback(err);
    }
  });
};

export const downloadStream = (url: string, formatId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Construct the yt-dlp command-line prompt
      const ytDlpPrompt = `yt-dlp -f ${formatId} ${url}`;
      resolve(ytDlpPrompt);
    } catch (error) {
      reject(`Failed to construct yt-dlp prompt: ${error}`);
    }
  });
};
