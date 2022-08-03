import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import { getEnabledPlugins, sanitizePath } from './shared.js';

function getWebviewImages(pluginName) {
    const pluginFolder = sanitizePath(path.join(process.cwd(), 'src/core/plugins', pluginName));
    if (!fs.existsSync(sanitizePath(path.join(pluginFolder, 'webview', 'images')))) {
        return 0;
    }

    let allFiles = [];
    let amountCopied = 0;

    for (let ext of ['png', 'gif', 'jpg', 'jpeg', 'webm']) {
        const files = glob.sync(sanitizePath(path.join(pluginFolder, `webview/images/**/*.${ext}`)));
        allFiles = allFiles.concat(files);
    }

    for (let i = 0; i < allFiles.length; i++) {
        const imgPath = allFiles[i];
        const finalPath = sanitizePath(imgPath.replace(/.*\/webview\/images/gm, `src-webviews/public/plugins/${pluginName}`))
        if (fs.existsSync(imgPath)) {
            const folderPath = sanitizePath(path.dirname(finalPath));
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            fs.copyFileSync(imgPath, finalPath);
            amountCopied += 1;
        }
    }

    return amountCopied;
}

function run() {
    const enabledPlugins = getEnabledPlugins();
    fs.emptyDirSync(sanitizePath('src-webviews/public/plugins/'));
    fs.writeFileSync(sanitizePath('src-webviews/public/plugins/.gitkeep'), '');

    let totalCopied = 0;

    for (const pluginName of enabledPlugins) {
        const count = getWebviewImages(pluginName);
        totalCopied += count;
    }

    console.log(`WebView Images Moved -- ${totalCopied}`);
}

run();
