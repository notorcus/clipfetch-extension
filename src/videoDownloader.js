// videoDownloader.js
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const downloadAndConvertVideo = async (youtubeLink) => {
    const cs = new CSInterface;

    // Set the output path
    const outputPath = "C:\\Users\\Akshat Kumar\\Editing\\Media\\PProClipFetch";
    const videoPath = path.join(outputPath, 'convertedVideo'); // This is where the video will be saved

    alert('Started download and conversion for: ' + youtubeLink); // Alert after starting the download

    try {
        await youtubedl(youtubeLink, {
            'output': videoPath,
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best',
            'postprocessor-args': '-c:v libx264 -preset fast',
            'merge-output-format': 'mp4',
            'no-check-certificate': true,
            'no-warnings': true,
            'prefer-free-formats': true,
            'add-header': [
                'referer:youtube.com',
                'user-agent:googlebot'
            ]
        });

        alert('Download and conversion complete!');
        // cs.evalScript(`$.runScript.importVideo("${videoPath.replace(/\\/g, '\\\\')}")`);
    } catch (error) {
        console.error('Error during download or conversion:', error);
        alert('Error processing video. Please try again.');
    }
}

window.downloadAndConvertVideo = downloadAndConvertVideo;