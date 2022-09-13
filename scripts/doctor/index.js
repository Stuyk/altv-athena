import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { fileChecker } from './files.js';
import { verifyFileNames } from '../fileChecker/index.js';

function sanitizePath(p) {
    return p.replace(/\\/g, '/');
}

async function init() {
    await cleanup();
    console.log(`-- Cleanup Complete, Perform the Following --`);
    console.log(`-- Execute these Commands in Console --`);
    console.log(`npm install or yarn install`);
    console.log(`npm run update or yarn update`);
}

async function cleanup() {
    if (fs.existsSync('package-lock.json')) {
        console.log(`Removing package-lock.json`);
        fs.unlinkSync('package-lock.json');
    }

    if (fs.existsSync('yarn.lock')) {
        console.log(`Removing yarn.lock`);
        fs.unlinkSync('yarn.lock');
    }

    if (fs.existsSync('node_modules')) {
        console.log(`Removing node_modules`);
        fs.rmSync('node_modules', { recursive: true, force: true });
    }

    if (fs.existsSync('athena-cache')) {
        console.log(`Removing athena-cache`);
        fs.rmSync('athena-cache', { recursive: true, force: true });
    }

    const coreResourcesPath = sanitizePath(path.join('resources', 'core'))
    if (fs.existsSync(coreResourcesPath)) {
        console.log(`Removing resources/core`);
        fs.rmSync(coreResourcesPath, { recursive: true, force: true });
    }

    const coreWebviewsPath = sanitizePath(path.join('resources', 'webviews'))
    if (fs.existsSync(coreWebviewsPath)) {
        console.log(`Removing resources/webviews`);
        fs.rmSync(coreWebviewsPath, { recursive: true, force: true });
    }

    if (fs.existsSync('cache')) {
        console.log(`Removing cache`);
        fs.rmSync('cache', { recursive: true, force: true });
    }

    let badFiles = [];
    badFiles = await new Promise((resolve) => {
        glob('./{src,src-webviews}/core/**/*.js', (err, files) => {
            if (err) {
                return resolve(files);
            }

            return resolve(files);
        });
    });

    for (const file of badFiles) {
        if (fs.existsSync(file)) {
            console.log(`Removed File: ${file}`);
            fs.rmSync(file, { recursive: true, force: true });
        }
    }

    const badFileTypeDefs = glob.sync('./src/**/*.d.ts');
    for (const file of badFileTypeDefs) {
        if (fs.existsSync(file)) {
            console.log(`Removed File: ${file}`);
            fs.rmSync(file, { recursive: true, force: true });
        }
    }

    // Checks for invalid file names...
    await fileChecker();

    // Check for ascii file names
    await verifyFileNames('src');
    await verifyFileNames('src-webviews');
}

init();
