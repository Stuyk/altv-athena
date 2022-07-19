import glob from 'glob';
import fs from 'fs'

async function start() {
    const files = glob.sync(`./src-webviews/public/assets/images/clothing/**/*.png`)
    for (let i = 0; i < files.length; i++) {
        files[i] = files[i].split(`/`).pop();
    }

    const componentsList = files.filter(f => {
        if (f.includes('prop')) {
            return false;
        }

        if (!f.includes('2-')) {
            return false;
        }

        return true;
    });

    fs.writeFileSync('clothes.json', JSON.stringify(componentsList, null, '\t'));
}

start();