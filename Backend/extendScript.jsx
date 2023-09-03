$.runScript = {
    importFile: function(filePath) {
        // alert("File path: " + filePath);
        var project = app.project;
        var bin = project.rootItem;
        project.importFiles([filePath], true, bin, false);
    },

    deleteFile: function (filePath) {
        var file = new File(filePath);
        if (file.exists) {
            if (file.remove()) {
                return true;
            } else {
                console.log("Failed to remove file. Check permissions.");
                return false;
            }
        } else {
            alert("File does not exist: " + filePath);
            console.log("File does not exist: " + filePath);
            return false;
        }
    }    
};
