import { globSync, writeFile } from '../shared/fileHelpers.js';

async function start() {
    let files = globSync(`./src-webviews/public/assets/images/clothing/**/*.png`);

    for (let i = 0; i < files.length; i++) {
        files[i] = files[i].split(`/`).pop();
    }

    const componentsList = files.filter((f) => {
        if (f.includes('prop')) {
            return false;
        }

        if (!f.includes('2-')) {
            return false;
        }

        return true;
    });

    writeFile('clothes.json', JSON.stringify(componentsList, null, '\t'));
}

start();
