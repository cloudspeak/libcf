const fs = require('fs')
const path = require('path');

module.exports = class FileUtils {

    createFolderTree(folderPath) {

        let relativePath = path.relative('.', folderPath);
        let folders = relativePath.split(path.sep);
        let base = '.'
    
        for (let folder of folders) {
            base = path.join(base, folder)
    
            if (!fs.existsSync(base)) {
                fs.mkdirSync(base)
            }
        }
    }
       
}