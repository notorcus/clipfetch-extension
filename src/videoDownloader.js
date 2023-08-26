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
        ytDlp.stderr.on('data', (data) => {
            errorData += data;
        });

        ytDlp.on('close', (code) => {
            if (code !== 0) {
                console.log("Error output:", errorData);
                reject(new Error(errorData));
            } else {
                resolve(filename);
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
        callback(null, { video: videoFile, audio: audioFile });
    }).catch(error => {
        callback(error);
    });
}

module.exports = { downloadVideo };
