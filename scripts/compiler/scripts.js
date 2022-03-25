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

    for (let i = 0; i < FOLDERS_TO_CLEAN.length; i++) {
        promises.push(fs.rm(path.join(process.cwd(), FOLDERS_TO_CLEAN[i]), { recursive: true, force: true }));
    }

    await Promise.all(promises);
}

async function getFiles() {
    return new Promise(async (resolve) => {
        let files = [];

        for (let i = 0; i < FILES_TO_COMPILE.length; i++) {
            const somePath = path.join(process.cwd(), FILES_TO_COMPILE[i]);
            const filesFound = await new Promise((resolve) => {
                glob(somePath, (err, _files) => {
                    resolve(_files);
                });
            });

            files = files.concat(filesFound);
        }

        resolve(files);
    });
}

async function copyFiles() {
    let promises = [];
    let files = [];

    for (let i = 0; i < FILES_TO_COPY.length; i++) {
        const somePath = path.join(process.cwd(), FILES_TO_COPY[i]);
        const somePromise = new Promise((resolve) => {
            glob(somePath, (err, _files) => {
                resolve(_files);
            });
        }).then((_files) => {
            files = files.concat(_files);
        });

        promises.push(somePromise);
    }

    await Promise.all(promises);
    promises = [];

    for (let i = 0; i < files.length; i++) {
        const originalPath = files[i];
        let newPath = files[i].replace('src/', 'resources/');
        const newPromise = fs.copy(originalPath, newPath, { recursive: true, overwrite: true });
        promises.push(newPromise);
    }

    await Promise.all(promises);
    return files;
}

async function compileFiles(files) {
    const coreFiles = [];

    for (let i = 0; i < files.length; i++) {
        swc.transformFile(files[i], SWC_CONFIG).then(async (output) => {
            let newPath = files[i].replace('src/', 'resources/').replace('.ts', '.js');

            if (files[i].includes('scripts')) {
                console.log(files[i]);
                newPath = files[i].replace('src/', 'dist/').replace('.ts', '.js');
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
        `[${time}] [SWC] ${filesCompiled.length} Files Transpiled - ${filesCopied.length} Files Copied - Total Time ${Date.now() - start
        }ms`,
    );
}

beginCompilation();
