// DownloadUtils.ts
import { spawn } from 'child_process';

export const getAvailableFormats = (url: string, callback: (error: any, data?: any) => void) => {
  console.log("invoked get format")
  const ytDlp = spawn('yt-dlp', ['-F', url]);

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
      callback(new Error(`yt-dlp process exited with code ${code}: ${errorOutput}`));
    } else {
      callback(null, output);
    }
  });
};
