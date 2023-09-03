// DownloadUtils.ts
import { spawn } from 'child_process';

export const getAvailableFormats = (url: string, callback: (error: any, data?: any) => void) => {
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
      const availableFormats = parsedData.formats;  // Assumes that 'formats' is the relevant key
      callback(null, availableFormats);
    } catch (err) {
      callback(err);
    }
  });
};
