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
      const availableFormats = parsedData.formats || [];  // Assumes that 'formats' is the relevant key

      // Group formats by resolution
      const formatsByResolution: { [resolution: string]: any[] } = {};
      const audioFormats: any[] = [];
      availableFormats.forEach((format: any) => {
        if (format.vcodec !== 'none') {  // Video-only formats
          const resolution = format.resolution || `${format.width}x${format.height}`;
          if (!formatsByResolution[resolution]) {
            formatsByResolution[resolution] = [];
          }
          formatsByResolution[resolution].push(format);
        } else if (format.acodec !== 'none') {  // Audio-only formats
          audioFormats.push(format);
        }
      });

      // Find the best format for each resolution based on vbr and fps
      const bestFormatsByResolution: { [resolution: string]: any } = {};
      for (const resolution in formatsByResolution) {
        const formats = formatsByResolution[resolution];
        formats.sort((a, b) => (b.vbr || 0) - (a.vbr || 0) || (b.fps || 0) - (a.fps || 0));
        bestFormatsByResolution[resolution] = formats[0];
      }

      // Sort audio formats by bitrate
      audioFormats.sort((a, b) => (b.abr || 0) - (a.abr || 0));
      const bestAudioFormats = audioFormats.map(format => ({
        format_id: format.format_id,
        abr: format.abr,
        friendlyName: `${format.abr}kbps`,
      }));

      callback(null, bestFormatsByResolution, bestAudioFormats);

    } catch (err) {
      callback(err);
    }
  });
};
