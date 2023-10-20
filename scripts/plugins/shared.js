import path from 'path';
import fs from 'node:fs';
import { sanitizePath } from '../shared/path.js';
import { copyAsync, globSync } from '../shared/fileHelpers.js';

const viablePluginDisablers = ['disable.plugin', 'disabled.plugin', 'disable', 'disabled'];

export function clearPluginsWebViewFolder() {
    const pluginsFolder = sanitizePath(path.join(process.cwd(), `src-webviews/public/plugins`));
    if (fs.existsSync(pluginsFolder)) {
        fs.rmSync(pluginsFolder, { recursive: true, force: true });
        fs.mkdirSync(pluginsFolder);
    }
}

export function getEnabledPlugins() {
    const pluginsFolder = sanitizePath(path.join(process.cwd(), 'src/core/plugins'));
    const plugins = fs.readdirSync(pluginsFolder);

    return plugins.filter((plugin) => {
        for (const disabler of viablePluginDisablers) {
            const filePath = sanitizePath(path.join(pluginsFolder, plugin, disabler));
            if (fs.existsSync(filePath)) {
                return false;
            }
        }

        return true;
    });
}

export async function moveAssetsToWebview(folderName, extensions) {
    const enabledPlugins = getEnabledPlugins();
    let amountCopied = 0;

    const promises = [];
    for (const pluginName of enabledPlugins) {
        const pluginFolder = sanitizePath(path.join(process.cwd(), `src/core/plugins/`, pluginName));
        if (!fs.existsSync(sanitizePath(path.join(pluginFolder, folderName)))) {
            continue;
        }

        const fullPath = sanitizePath(path.join(pluginFolder, `${folderName}/**/*.+(${extensions.join('|')})`));
        const allFiles = globSync(fullPath);

        for (const element of allFiles) {
            const filePath = element;
            const regExp = new RegExp(`.*\/${folderName}\/`);
            const finalPath = sanitizePath(filePath.replace(regExp, `src-webviews/public/plugins/`));
            const folderPath = sanitizePath(path.dirname(finalPath));
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            promises.push(copyAsync(filePath, finalPath));
            amountCopied += 1;
        }
    }

    await Promise.all(promises);
}

export async function movePluginFilesToWebview(folderName, extensions, isSrc = false) {
    const normalizedName = folderName.replace('webview/', '');

    // First Perform Extension & Sub Directory Cleanup
    const oldFiles = !isSrc
        ? globSync(`src-webviews/src/plugins/${normalizedName}/**/*.+(${extensions.join('|')})`)
        : globSync(`src-webviews/public/plugins/${normalizedName}/**/*.+(${extensions.join('|')})`);

    await cleanUpOldFiles(oldFiles);

    // Next Scan Available Plugins
    const enabledPlugins = getEnabledPlugins();

    for (const pluginName of enabledPlugins) {
        const pluginFolder = sanitizePath(path.join(process.cwd(), 'src/core/plugins', pluginName));
        const folderPath = sanitizePath(path.join(pluginFolder, folderName));

        if (!fs.existsSync(folderPath)) continue;

        const allFiles = globSync(sanitizePath(path.join(pluginFolder, folderName, `**/*.+(${extensions.join('|')})`)));

        await Promise.all(allFiles.map(async (filePath) => {
            const finalPath = filePath.replace(new RegExp(`.*\/${folderName}\/`), isSrc
                ? `src-webviews/src/plugins/${normalizedName}/${pluginName}/`
                : `src-webviews/public/plugins/${normalizedName}/${pluginName}/`
            );

            if (!fs.existsSync(filePath)) return;

            const folderPath = path.dirname(finalPath);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            await copyAsync(filePath, finalPath);
        }));
    }
}

async function cleanUpOldFiles(oldFiles) {
    for (const oldFile of oldFiles) {
        if (fs.existsSync(oldFile)) {
            fs.rmSync(oldFile, { force: true });
        }

        const directory = sanitizePath(path.dirname(oldFile));
        if (fs.existsSync(directory)) {
            const files = fs.readdirSync(directory);
            if (files.length <= 0) {
                fs.rmdirSync(directory, { maxRetries: 999, retryDelay: 100 });
            }
        }
    }
}