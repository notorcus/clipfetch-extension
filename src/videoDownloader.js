// videoDownloader.js
const { exec } = require('child_process');

function downloadVideo(link, callback) {
    // Define the output directory and filenames
    const outputPath = 'C:\\Users\\Akshat Kumar\\Editing\\Media\\PProClipFetch\\';
    const videoFile = `"${outputPath}%(title)s_video.mp4"`;
    const audioFile = `"${outputPath}%(title)s_audio.m4a"`;

    // Download the best video stream
    exec(`yt-dlp -f bestvideo[ext=mp4] -o ${videoFile} ${link}`, (error, stdout, stderr) => {
        if (error) {
            callback(error);
            return;
        }

        // Download the best audio stream
        exec(`yt-dlp -f bestaudio[ext=m4a] -o ${audioFile} ${link}`, (audioError, audioStdout, audioStderr) => {
            if (audioError) {
                callback(audioError);
                return;
            }

            // Return the video and audio file paths to the callback
            callback(null, {
                video: videoFile.replace(/"/g, ''),
                audio: audioFile.replace(/"/g, '')
            });
        });
    });
}

module.exports = { downloadVideo };