import path from 'path';
import fs from 'fs';
import { globSync, writeFile } from '../shared/fileHelpers.js';
import { sanitizePath } from '../shared/path.js';

const startTime = Date.now();
const resourcePath = sanitizePath(path.join(process.cwd(), 'resources/core/**/*.js'));
const filePaths = globSync(resourcePath);

const funcsToIgnore = [
    //
    'export function',
    'export const',
    'export let',
    'export async function',
    '=>',
];

let count = 0;
for (let filePath of filePaths) {
    const fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const splitContents = fileContents.split(/\r?\n/);

    const filePathing = filePath.split('/');
    filePathing.pop();
    const directoryPath = filePathing.join('/');

    let wasModified = false;
    for (let i = 0; i < splitContents.length; i++) {
        if (!splitContents[i].includes('import') && !splitContents[i].includes('export')) {
            continue;
        }

        let shouldSkip = false;
        for (let funcToIgnore of funcsToIgnore) {
            if (splitContents[i].includes(funcToIgnore)) {
                shouldSkip = true;
                break;
            }
        }

        if (shouldSkip) {
            continue;
        }

        const filePathReg = new RegExp(/('|").*.('|")/g);
        const extractions = splitContents[i].match(filePathReg);
        if (extractions === null || !extractions) {
            continue;
        }

        const relativeFilePath = extractions[0].replace(/'/gm, '').replace(/"/gm, '');
        if (relativeFilePath.charAt(0) !== '.' && relativeFilePath.charAt(0) !== '/') {
            continue;
        }

        const actualFilePath = path.join(directoryPath, relativeFilePath).replace(/\\/gm, '/');
        if (fs.existsSync(actualFilePath)) {
            const barrelFileTest = fs.statSync(actualFilePath);
            if (barrelFileTest.isDirectory()) {
                splitContents[i] = splitContents[i].replace(relativeFilePath, `${relativeFilePath}/index.js`);
                wasModified = true;
                continue;
            }
        }

        if (!splitContents[i].includes('.js')) {
            splitContents[i] = splitContents[i].replace(relativeFilePath, `${relativeFilePath}.js`);
            wasModified = true;
        }
    }

    if (!wasModified) {
        continue;
    }

    const finalFile = splitContents.join('\r\n');
    writeFile(filePath, finalFile);
    count += 1;
}
