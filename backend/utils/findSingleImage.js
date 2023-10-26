import fs from 'fs/promises';
import path from 'path';

export const getFile = async (timestamp) => {
    const folderPath = './backend/upload';

    const files = await fs.readdir(folderPath);
    console.log(files);

    const matchingFile = files.find((file) => {
        if (file.startsWith('image-') && file.endsWith('.jpeg')) {
            const fileTimestamp = parseInt(file.split('-')[1].split('.')[0]);
            console.log(fileTimestamp);
            return fileTimestamp === timestamp;
        }
        return false;
    });

    if (matchingFile) {
        return path.join(folderPath, matchingFile);
    } else {
        return null; // No matching file found
    }
};
