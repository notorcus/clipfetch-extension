const { spawn } = require('child_process');
const { exec } = require('child_process');

function downloadStream(format, outputPath, link) {
    return new Promise((resolve, reject) => {
        const ytDlpPath = "C:\\Users\\Akshat Kumar\\AppData\\Roaming\\Python\\Python311\\Scripts\\yt-dlp.exe";
        const filename = `${outputPath}%(title)s_${format}.%(ext)s`;

        let args;
        if (format === 'video') {
            args = ['-f', 'bestvideo[acodec=none]', '-o', filename, link];
        } else {
            args = ['-f', 'bestaudio[vcodec=none]', '-o', filename, link];
        }

        const ytDlp = spawn(ytDlpPath, args);

        let errorData = '';
        let outputData = '';

        ytDlp.stderr.on('data', (data) => {
            errorData += data;
        });

        ytDlp.stdout.on('data', (data) => {
            outputData += data;
        });

        ytDlp.on('close', (code) => {
            // console.log("yt-dlp output:", outputData);
            if (code !== 0) {
                console.log("Error output:", errorData);
                reject(new Error(errorData));
            } else {
                // Parse the output to get the filename
                const lines = outputData.split('\n');
                let downloadedFilePath;

                for (const line of lines) {
                    if (line.startsWith('[download] C:\\')) {
                        downloadedFilePath = line.replace('[download] ', '').split(' has already been downloaded')[0].trim();
                        if (downloadedFilePath.endsWith('% of    3.83MiB')) {
                            downloadedFilePath = downloadedFilePath.replace(' 100% of    3.83MiB', '').trim();
                        }
                        break;
                    }
                }

                if (downloadedFilePath) {
                    resolve(downloadedFilePath);
                } else {
                    reject(new Error("Couldn't parse the filename from yt-dlp output."));
                }
            }
        });
    });
}

function checkNvencSupport(callback) {
    exec('ffmpeg -encoders | find "nvenc"', (error, stdout, stderr) => {
        if (stdout.includes("nvenc")) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

function mergeStreams(videoFile, audioFile, outputPath) {
    return new Promise((resolve, reject) => {
        // Extract title from videoFile using regex
        const titleMatch = videoFile.match(/([^\\]+)_(?:video|audio)\.\w+$/);
        if (!titleMatch) {
            reject(new Error("Couldn't parse the title from the video file path."));
            return;
        }
        const title = titleMatch[1];
        const mergedFilename = `${outputPath}${title}.mp4`; 

        const ffmpegPath = "ffmpeg";

        checkNvencSupport((supportsNvenc) => {
            let args;
            
            if (supportsNvenc) {
                console.log("Using NVENC for encoding.");
                args = ['-y', '-i', videoFile, '-i', audioFile, '-c:v', 'h264_nvenc', '-preset', 'fast', '-c:a', 'aac', '-strict', 'experimental', '-f', 'mp4', mergedFilename];
            } else {
                console.log("Using libx264 for encoding.");
                args = ['-y', '-i', videoFile, '-i', audioFile, '-c:v', 'libx264', '-preset', 'fast', '-c:a', 'aac', '-strict', 'experimental', '-f', 'mp4', mergedFilename];
            }

            const ffmpeg = spawn(ffmpegPath, args);

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
    });
}



function downloadVideo(link, callback) {
    const outputPath = 'C:\\Users\\Akshat Kumar\\Editing\\Media\\PProClipFetch\\';

    Promise.all([
        downloadStream('video', outputPath, link),
        downloadStream('audio', outputPath, link)
    ]).then(([videoFile, audioFile]) => {
        console.log("Starting conversion...");
        return mergeStreams(videoFile, audioFile, outputPath);
    }).then(mergedFile => {
        callback(null, mergedFile);
    }).catch(error => {
        callback(error);
    });
}

module.exports = { downloadVideo };
