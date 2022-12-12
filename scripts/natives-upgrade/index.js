import glob from 'glob';
import fs from 'fs';

async function start() {
    glob('./src/core/**/*.ts', (err, files) => {
        if (err) {
            return resolve(files);
        }

        const nativeContent = JSON.parse(fs.readFileSync('./scripts/natives-upgrade/replacements.json', 'utf-8'));

        for (let filePath of files) {
            let originalContent = fs.readFileSync(filePath, 'utf-8');

            for (let native of nativeContent) {
                if (originalContent.includes(native.from)) {
                    console.log(`[Native Replacement] ${native.from}, replaced with ${native.to}`);
                    originalContent = originalContent.replace(native.from, native.to);
                }
            }

            fs.writeFileSync(filePath, originalContent);
        }
    });
}

start();
