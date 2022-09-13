import { readdirSync } from 'fs';

let filesScanned = 0;
let invalidFileList = [];

export const verifyFileNames = (dirName, isFirst = true) => {
    const items = readdirSync(dirName, { withFileTypes: true });

    for (const item of items) {
        const isFileValid = /^[\u0000-\u007f]*$/.test(item.name);
        if (item.isDirectory()) {
            verifyFileNames(`${dirName}/${item.name}`, false);
        } else {
            if (isFileValid) {
                filesScanned++;
            } else {
                invalidFileList.push(`${dirName}/${item.name}`);
                filesScanned++;
            }
        }
    }

    if (!isFirst) {
        return;
    }

    console.log(`Directory Scanned -- ${dirName}`);
    console.log(`Files Scanned: ${filesScanned}`);
    if (invalidFileList.length >= 1) {
        console.log(`Invalid Files: ${invalidFileList.length}`);
        for (let file of invalidFileList) {
            console.log(file);
        }
    }
};