const youtubedl = require('youtube-dl-exec');
const path = require('path');

const updateProgressBar = (value) => {
    const progressBar = document.getElementById('progressBar');
    const statusMessage = document.getElementById('statusMessage');
    progressBar.value = value;
    statusMessage.innerText = `Downloading... ${value}%`;
};

const showProgressBar = () => {
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.style.display = 'block';
};

const hideProgressBar = () => {
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.style.display = 'none';
};

const downloadAndConvertVideo = async (youtubeLink) => {
    const cs = new CSInterface;

    // Set the output path
    const outputPath = "C:\\Users\\Akshat Kumar\\Editing\\Media\\PProClipFetch";
    const videoPath = path.join(outputPath, 'convertedVideo.mp4'); // This is where the video will be saved

    showProgressBar();
    alert('Started download and conversion for: ' + youtubeLink); // Alert after starting the download

    try {
        // Simulated progress bar update
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 100) {
                progress += 5;  // Increment by 5%
                updateProgressBar(progress);
            } else {
                clearInterval(interval);
                hideProgressBar();
            }
        }, 1000);  // Update every second

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

        clearInterval(interval);
        updateProgressBar(100);
        hideProgressBar();
        alert('Download and conversion complete!');
    } catch (error) {
        clearInterval(interval);
        hideProgressBar();
        console.error('Error during download or conversion:', error);
        alert('Error processing video. Please try again.');
    }
}

window.downloadAndConvertVideo = downloadAndConvertVideo;
