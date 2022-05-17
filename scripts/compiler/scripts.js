import swc from '@swc/core';
import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';

const FILES_TO_COMPILE = [
    //
    'scripts/streamer/src/**/*.ts',
];

const FILES_TO_COPY = [];

const FOLDERS_TO_CLEAN = [
    //
    'scripts/streamer/dist',
];

const SWC_CONFIG = {
    jsc: {
        parser: {
            syntax: 'typescript',
            dynamicImport: true,
        },
        target: 'es2020',
    },
    sourceMaps: true,
};

async function cleanFolders() {
    const promises = [];

    for (const folder of FOLDERS_TO_CLEAN) {
        promises.push(fs.rm(path.join(process.cwd(), folder), { recursive: true, force: true }));
    }

    await Promise.all(promises);
}

function generatePromise(somePath) {
    return new Promise((resolve) => {
        glob(somePath, (_err, _files) => {
            resolve(_files);
        });
    });
}

async function getFiles() {
    return new Promise(async () => {
        let files = [];
        for (const file of FILES_TO_COMPILE) {
            const somePath = path.join(process.cwd(), file).replace(/\\/g, '/');
            const filesFound = generatePromise(somePath);

            files = files.concat(filesFound);
        }
    });
}

async function copyFiles() {
    let promises = [];
    let files = [];

    if (FILES_TO_COPY.length > 0) {
        for (const file of FILES_TO_COPY) {
            const somePath = path.join(process.cwd(), file).replace(/\\/g, '/');
            const somePromise = generatePromise(somePath).then((_files) => {
                files = files.concat(_files);
            });

            promises.push(somePromise);
        }
    }

    await Promise.all(promises);
    promises = [];

    for (const file of files) {
        const originalPath = file;
        let newPath = file.replace('src/', 'resources/');
        const newPromise = fs.copy(originalPath, newPath, { recursive: true, overwrite: true });
        promises.push(newPromise);
    }

    await Promise.all(promises);
    return files;
}

async function compileFiles(files) {
    const coreFiles = [];

    for (const file of files) {
        swc.transformFile(file, SWC_CONFIG).then(async (output) => {
            let newPath = file.replace('src/', 'resources/').replace('.ts', '.js');

            if (file.includes('scripts')) {
                console.log(file);
                newPath = file.replace('src/', 'dist/').replace('.ts', '.js');
            }

            const coreFile = {
                path: newPath,
                code: output.code,
            };

            await new Promise((resolve) => {
                fs.unlink(coreFile.path, () => {
                    resolve();
                });
            });

            await fs.outputFile(coreFile.path, coreFile.code);
            coreFiles.push(coreFile.path);
        });
    }

    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (coreFiles.length !== files.length) {
                return;
            }

            clearInterval(interval);
            resolve();
        }, 0);
    });

    return coreFiles;
}

async function beginCompilation() {
    const start = Date.now();
    const files = await getFiles();
    await cleanFolders();
    const filesCompiled = await compileFiles(files);
    const filesCopied = await copyFiles();

    const currentTime = new Date(Date.now()).toISOString();
    const result = currentTime.match(/\d\d:\d\d:\d\d/);
    const time = result && Array.isArray(result) && result.length >= 1 ? result[0] : '00:00:00';
    console.log(
        `[${time}] [SWC] ${filesCompiled.length} Files Transpiled - ${filesCopied.length} Files Copied - Total Time ${
            Date.now() - start
        }ms`,
    );
}

beginCompilation();
