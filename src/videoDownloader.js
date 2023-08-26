const { spawn } = require('child_process');

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
            console.log("yt-dlp output:", outputData);
            if (code !== 0) {
                console.log("Error output:", errorData);
                reject(new Error(errorData));
            } else {
                // Parse the output to get the filename
                const match = outputData.match(/Destination:\s*(.+)|\[download\]\s*(.+?)\shas already been downloaded/);
                if (match && match[1]) {
                    const downloadedFilePath = match[1] ? match[1].trim() : match[2].trim();
                    resolve(downloadedFilePath);
                } else {
                    reject(new Error("Couldn't parse the filename from yt-dlp output."));
                }
            }
        });
    });
}



function mergeStreams(videoFile, audioFile, outputPath) {
    return new Promise((resolve, reject) => {
        const mergedFilename = `${outputPath}merged_output.mp4`;  // Modify filename as needed
        const ffmpegPath = "ffmpeg";  // Use full path if ffmpeg is not globally accessible
        const args = ['-i', videoFile, '-i', audioFile, '-c:v', 'libx264', '-preset', 'fast', '-c:a', 'aac', '-strict', 'experimental', '-f', 'mp4', mergedFilename];

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
