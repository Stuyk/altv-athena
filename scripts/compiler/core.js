import swc from '@swc/core';
import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';

const viablePluginDisablers = ['disable.plugin', 'disabled.plugin', 'disable'];

/** @type {import('@swc/core').Config} */
const SWC_CONFIG = {
    jsc: {
        parser: {
            syntax: 'typescript',
            dynamicImport: true,
            decorators: true,
        },
        transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
        },
        target: 'es2020',
    },
    sourceMaps: true,
};

function sanitizePath(p) {
    return p.replace(/\\/g, path.sep);
}

function getEnabledPlugins() {
    const rootPath = sanitizePath(path.join(process.cwd(), 'src/core/plugins')).replace(/\\/g, '/');
    const pluginFolders = fs.readdirSync(rootPath);

    return pluginFolders.filter((pluginName) => {
        const pluginPath = sanitizePath(path.join(rootPath, pluginName)).replace(/\\/g, '/');

        for (const fileName of viablePluginDisablers) {
            const disabledPath = sanitizePath(path.join(pluginPath, fileName)).replace(/\\/g, '/');

            if (fs.existsSync(disabledPath)) {
                return false;
            }
        }

        return true;
    });
}

function getFilesForTranspilation(enabledPlugins) {
    const rootPath = sanitizePath(path.join(process.cwd(), 'src/**/*.ts').replace(/\\/g, '/'));
    const files = glob.sync(rootPath, {
        nodir: true,
        ignore: [
            '**/node_modules/**',
            '**/core/plugins/**', // ignore plugins - will be handled seperatly
        ],
    });

    for (const pluginName of enabledPlugins) {
        const pluginPath = sanitizePath(path.join(process.cwd(), 'src/core/plugins', pluginName).replace(/\\/g, '/'));
        const pluginFiles = glob.sync(path.join(pluginPath, '**/*.ts').replace(/\\/g, '/'), {
            nodir: true,
            ignore: ['**/imports.ts', '**/webview/**'],
        });

        for (const file of pluginFiles) {
            files.push(file);
        }
    }

    return files;
}

function getFilesToCopy(enabledPlugins) {
    const filePath = sanitizePath(path.join(process.cwd(), 'src', '**/*.!(ts|vue|md)').replace(/\\/g, '/'));

    return glob.sync(filePath, {
        nodir: true,
        ignore: ['**/tsconfig.json', '**/dependencies.json', `**/core/plugins/!(${enabledPlugins.join('|')})/**`],
    });
}

async function transpileFile(file) {
    const targetPath = file.replace('src/', 'resources/').replace('.ts', '.js');

    return new Promise(async (resolve) => {
        const result = await swc.transformFile(file, SWC_CONFIG);
        fs.outputFileSync(targetPath, result.code);
        resolve();
    });
}

async function run() {
    const startTime = +new Date();
    const enabledPlugins = getEnabledPlugins();

    const filesToTranspile = getFilesForTranspilation(enabledPlugins);
    const filesToCopy = getFilesToCopy(enabledPlugins);

    const resourcesFolder = sanitizePath(path.join(process.cwd(), 'resources')).replace(/\\/g, '/');
    const filesAndDirectories = await fs.readdir(resourcesFolder);

    for (const fileOrDirectory of filesAndDirectories) {
        const fullPath = sanitizePath(path.join(resourcesFolder, fileOrDirectory)).replace(/\\/g, '/');
        if (fullPath.includes('mods')) {
            continue;
        }

        if (fs.statSync(fullPath).isDirectory()) {
            await fs.rmSync(fullPath, { recursive: true, force: true });
        }
    }

    for (const file of filesToCopy) {
        const targetPath = file.replace('src/', 'resources/');
        fs.copy(file, targetPath, { overwrite: true });
    }

    const promises = filesToTranspile.map((file) => transpileFile(file));
    await Promise.all(promises);

    const elapsedTime = +new Date() - startTime;
    console.log(`Transpiled ${filesToTranspile.length} files`);
    console.log(`Copied ${filesToCopy.length} files to resources folder`);
    console.log(`Build completed in: ${elapsedTime}ms`);
}

run();
