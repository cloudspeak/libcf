import * as fs from 'fs'
import * as path from 'path'


export class FileUtils {

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