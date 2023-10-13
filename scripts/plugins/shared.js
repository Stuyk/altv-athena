import path from 'path';
import fs from 'node:fs';
import { sanitizePath } from '../shared/path.js';
import { copySync, globSync } from '../shared/fileHelpers.js';

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

export function moveAssetsToWebview(folderName, extensions) {
    const enabledPlugins = getEnabledPlugins();
    let amountCopied = 0;
    for (const pluginName of enabledPlugins) {
        const pluginFolder = sanitizePath(path.join(process.cwd(), `src/core/plugins/`, pluginName));
        if (!fs.existsSync(sanitizePath(path.join(pluginFolder, folderName)))) {
            continue;
        }

        const fullPath = sanitizePath(path.join(pluginFolder, `${folderName}/**/*.+(${extensions.join('|')})`));
        const allFiles = globSync(fullPath);

        for (let i = 0; i < allFiles.length; i++) {
            const filePath = allFiles[i];
            const regExp = new RegExp(`.*\/${folderName}\/`);
            const finalPath = sanitizePath(filePath.replace(regExp, `src-webviews/public/plugins/`));
            const folderPath = sanitizePath(path.dirname(finalPath));
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            copySync(filePath, finalPath);
            amountCopied += 1;
        }
    }
}

export function movePluginFilesToWebview(folderName, extensions, isSrc = false) {
    const normalizedName = `${folderName}`.replace('webview/', '');

    // First Perform Extension & Sub Directory Cleanup
    let oldFiles;

    if (!isSrc) {
        oldFiles = globSync(
            sanitizePath(path.join(`src-webviews/public/plugins/${normalizedName}/**/*.+(${extensions.join('|')})`)),
        );
    } else {
        oldFiles = globSync(
            sanitizePath(path.join(`src-webviews/src/plugins/${normalizedName}/**/*.+(${extensions.join('|')})`)),
        );
    }

    for (let oldFile of oldFiles) {
        if (fs.existsSync(oldFile)) {
            fs.rmSync(oldFile, { force: true });
        }

        const directory = sanitizePath(path.dirname(oldFile));
        if (fs.existsSync(directory)) {
            const files = fs.readdirSync(directory);
            if (files.length <= 0) {
                fs.rmdirSync(directory);
            }
        }
    }

    // Next Scan Available Plugins
    const enabledPlugins = getEnabledPlugins();

    let amountCopied = 0;
    for (const pluginName of enabledPlugins) {
        const pluginFolder = sanitizePath(path.join(process.cwd(), `src/core/plugins/`, pluginName));
        if (!fs.existsSync(sanitizePath(path.join(pluginFolder, folderName)))) {
            continue;
        }

        const allFiles = globSync(
            sanitizePath(path.join(pluginFolder, `${folderName}/**/*.+(${extensions.join('|')})`)),
        );
        for (let i = 0; i < allFiles.length; i++) {
            const filePath = allFiles[i];
            const regExp = new RegExp(`.*\/${folderName}\/`);
            let finalPath;

            if (!isSrc) {
                finalPath = sanitizePath(
                    filePath.replace(regExp, `src-webviews/public/plugins/${normalizedName}/${pluginName}/`),
                );
            } else {
                finalPath = sanitizePath(
                    filePath.replace(regExp, `src-webviews/src/plugins/${normalizedName}/${pluginName}/`),
                );
            }

            if (fs.existsSync(filePath)) {
                const folderPath = sanitizePath(path.dirname(finalPath));
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }

                copySync(filePath, finalPath);
                amountCopied += 1;
            }
        }
    }
}
