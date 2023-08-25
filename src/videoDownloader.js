// videoDownloader.js
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const downloadVideo = (youtubeLink) => {
    const cs = new CSInterface;

    // Set the output path
    const outputPath = "C:\\Users\\Akshat Kumar\\Editing\\Media\\PProClipFetch";
    const videoPath = path.join(outputPath, 'downloadedVideo.mp4'); // This is where the video will be saved

    alert('Started download for: ' + youtubeLink); // Alert after starting the download

    youtubedl(youtubeLink, {
        'output': videoPath,
        'format': 'bestvideo+bestaudio/best',  // Download best video and audio format available
        'no-check-certificate': true,
        'no-warnings': true,
        'prefer-free-formats': true,
        'add-header': [
            'referer:youtube.com',
            'user-agent:googlebot'
        ]
    }).then(output => {
        alert('Download complete!');
        cs.evalScript(`$.runScript.importVideo("${videoPath.replace(/\\/g, '\\\\')}")`);
    }).catch(error => {
        console.error('Error during download:', error);
        alert('Error downloading video. Please try again.');
    });
}


window.downloadVideo = downloadVideo;