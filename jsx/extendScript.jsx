$.runScript = {
    importVideo: function(filePath) {
        alert("File path: " + filePath); // Include the file path in the alert
        var project = app.project;
        var bin = project.rootItem;
        project.importFiles([filePath], true, bin, false);
    }
};
