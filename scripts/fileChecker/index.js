import { readdirSync } from 'fs';

let filesScanned = 0;
let invalidFiles = 0;
let invalidFileList = [];

const scanFiles = (dirName) => {
    const items = readdirSync(dirName, { withFileTypes: true });

    for (const item of items) {
        const isFileValid = /^[\u0000-\u007f]*$/.test(item.name);
        if (item.isDirectory()) {
            scanFiles(`${dirName}/${item.name}`);
        } else {
            if (isFileValid) {
                filesScanned++;
            } else {
                invalidFileList.push(`${dirName}/${item.name}`);
                invalidFiles++;
                filesScanned++;
            }
        }
    }
};

scanFiles('src');
scanFiles('src-webviews');

process.stdout.write('Files Scanned: ' + filesScanned + '\n');
if (invalidFiles > 0) {
    process.stdout.write('Invalid Files: ' + invalidFiles + '\n');
    process.stdout.write('\x1b[93mInvalid File List: \x1b[39m' + invalidFileList.join(', ') + ' \n');
} else {
    process.stdout.write('All scanned files are valid.\n');
}
