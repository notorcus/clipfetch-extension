const ytdlpWrap = require('yt-dlp-wrap');

const downloadVideo = (youtubeLink) => {
    const cs = new CSInterface;

    // Set the output path
    const outputPath = "C:\\Users\\Akshat Kumar\\Editing\\Media";

    const videoPath = path.join(outputPath, 'downloadedVideo.mp4'); // This is where the video will be saved

    alert('Started download for: ' + youtubeLink); // Alert after starting the download

    ytdlpWrap.exec([youtubeLink, '-o', videoPath], (err, data) => {
        if (err) {
            console.error('Error during download:', err);
            alert('Error downloading video. Please try again.');
            return;
        }

        cs.evalScript(`$.runScript.importVideo("${videoPath.replace(/\\/g, '\\\\')}")`);
    });
}
