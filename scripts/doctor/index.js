import fs from 'fs';
import glob from 'glob';

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

    if (fs.existsSync('resources')) {
        console.log(`Removing resources`);
        fs.rmSync('resources', { recursive: true, force: true });
    }

    if (fs.existsSync('cache')) {
        console.log(`Removing cache`);
        fs.rmSync('cache', { recursive: true, force: true });
    }

    let badFiles = [];
    badFiles = await new Promise(resolve => {
        glob('./src/core/**/*.js', (err, files) => {
            if (err) {
                return resolve(files);;
            }

            return resolve(files);
        });
    });

    for (let i = 0; i < badFiles.length; i++) {
        if (fs.existsSync(badFiles[i])) {
            fs.rmSync(badFiles[i], { recursive: true, force: true });
        }
    }
}

init();
