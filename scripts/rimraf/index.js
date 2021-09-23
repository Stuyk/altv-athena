import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const LINUX_REMOVAL = `rm -rf FULL_PATH`;
const WINDOWS_REMOVAL = `rmdir /q/s FULL_PATH`

const DIR_RESOURCES = '/resources';
const FULL_RESOURCE_PATH = path.join(process.cwd(), DIR_RESOURCES)

async function cleanup() {
    console.log('Starting Cleanup');

    if (!fs.existsSync(FULL_RESOURCE_PATH)) {
        fs.mkdirSync(FULL_RESOURCE_PATH);
        console.log('Finished Cleanup')
        return;
    }

    const isWin = process.platform.includes('win');
    execSync(isWin ? WINDOWS_REMOVAL.replace('FULL_PATH', FULL_RESOURCE_PATH) : LINUX_REMOVAL.replace('FULL_PATH', FULL_RESOURCE_PATH));

    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (fs.existsSync(FULL_RESOURCE_PATH)) {
                return;
            }

            clearInterval(interval);
            return resolve();
        }, 100);
    });

    if (!fs.existsSync(FULL_RESOURCE_PATH)) {
        fs.mkdirSync(FULL_RESOURCE_PATH)
    }

    console.log('Finished Cleanup')
}

cleanup();

