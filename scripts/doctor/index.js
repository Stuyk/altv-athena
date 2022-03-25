import fs from 'fs';

async function init() {
    await cleanup();
    console.log(`-- Cleanup Complete, Perform the Following --`);
    console.log(`-- Execute these Commands in Console --`);
    console.log(`npm install`);
    console.log(`npm run update`);
}

function cleanup() {
    if (fs.existsSync('package-lock.json')) {
        console.log(`Removing package-lock.json`);
        fs.unlinkSync('package-lock.json');
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
}

init();
