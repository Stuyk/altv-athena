import { ChildProcess, spawn } from 'child_process';
import fkill from 'fkill';
import fs from 'fs';
import crypto from 'crypto';
import { copySync, globSync, areKeyResourcesReady } from '../shared/fileHelpers.js';
import { buildResources } from '../buildresource/index.js';
import { runCoreCompiler } from '../compiler/core.js';
import { runPluginsCompiler } from '../plugins/core.js';
import { copyPluginFiles } from '../plugins/files.js';
import { compileWebviewPlugins } from '../plugins/webview.js';
import { updatePluginDependencies } from '../plugins/update-dependencies.js';

const DEBUG = true;

const NO_SPECIAL_CHARACTERS = new RegExp(/^[ A-Za-z0-9_-]*$/gm);

const ports = [7788, 'altv-server', 'altv-server.exe', 3399, 3001];
const node = 'node';

const isLinux = process.platform === 'win32' ? false : true;

const npx = !isLinux ? 'npx.cmd' : 'npx';
const npm = !isLinux ? 'npm.cmd' : 'npm';
const serverBinary = !isLinux ? 'altv-server.exe' : './altv-server';

const passedArguments = process.argv.slice(2).map((arg) => arg.replace('--', ''));
const fileNameHashes = {};

if (NO_SPECIAL_CHARACTERS.test(process.cwd())) {
    console.warn(`Hey! A folder in your Athena path has special characters in it.`);
    console.warn(`Please rename your folder, or folders to a name that doesn't have special characters in it.`);
    console.warn(`Special Characters: ()[]{}|:;'<>?,!@#$%^&*+=`);
    process.exit(1);
}

/**
 * This is the alt:V Server Process
 * @type {ChildProcess} */
let lastServerProcess;

/**
 * This is the Streamer Server Process
 * @type {ChildProcess} */
let lastStreamerProcess;

/**
 * This is the WebView Dev Server Process
 * Runs on localhost:3000;
 * @type {ChildProcess} */
let lastViteServer;

/**
 * Previous files used in runtime.
 * @type {Array<string>}
 * */
let previousGlobFiles = [];

let fileWatchTimeout = Date.now() + 1000;

function createExecTime(name) {
    const startTime = Date.now();
    return {
        stop: () => {
            console.log(`${name} - ${Date.now() - startTime}ms`);
        },
    };
}

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * This function waits for a process to be fully killed first.
 * @param {ChildProcess} process
 */
async function killChildProcess(process) {
    if (!process) {
        return;
    }

    while (process.killed === false) {
        process.kill();

        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }
}

async function runFile(processName, ...args) {
    const spawnedProcess = spawn(processName, [...args], { stdio: 'inherit' });
    return new Promise((resolve) => {
        spawnedProcess.once('exit', () => {
            resolve();
        });

        spawnedProcess.on('error', (err) => {
            console.error(err);
            process.exit(1);
        });
    });
}

async function handleConfiguration() {
    let configName = 'prod';

    if (passedArguments.includes('dev')) {
        configName = 'dev';
    } else if (passedArguments.includes('devtest')) {
        configName = 'devtest';
    }

    if (!passedArguments.includes('dev')) {
        await runFile(npx, 'vite', 'build', './src-webviews');
    }

    copySync(`./configs/${configName}.toml`, `server.toml`);
    await buildResources();
}

async function handleViteDevServer() {
    if (lastViteServer && !lastViteServer.killed) {
        lastViteServer.kill();
    }

    await runFile(node, './scripts/plugins/webview.js');
    lastViteServer = spawn(
        npx,
        ['vite', './src-webviews', '--clearScreen', '--debug=true', '--host=localhost', '--port=3000'],
        { stdio: 'pipe' },
    );

    lastViteServer.stdout.on('data', (dat) => {
        console.log(dat.toString());
    });

    lastViteServer.once('close', (code) => {
        console.log(`Vite process exited with code ${code}`);
    });

    lastViteServer.on('spawn', () => {
        console.log(`>>> Vue Pages Server: https://localhost:3000`);
    });

    return await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

function handleStreamerProcess(shouldAutoRestart = false) {
    if (lastStreamerProcess && !lastStreamerProcess.killed) {
        lastStreamerProcess.kill();
    }

    lastStreamerProcess = spawn(node, ['./scripts/streamer/dist/index.js'], { stdio: 'inherit' });
    lastStreamerProcess.once('close', (code) => {
        console.log(`Streamer process exited with code ${code}`);
        if (shouldAutoRestart) {
            handleStreamerProcess(shouldAutoRestart);
        }
    });
}

async function handleServerProcess(shouldAutoRestart = false) {
    if (lastServerProcess && !lastServerProcess.killed) {
        lastServerProcess.kill();
    }

    if (process.platform !== 'win32') {
        await runFile('chmod', '+x', `./altv-server`);
    }

    await areKeyResourcesReady();
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (passedArguments.includes('cdn')) {
        lastServerProcess = spawn(serverBinary, ['--justpack'], { stdio: 'inherit' });

        lastServerProcess.once('exit', () => {
            const finalDestination = `${process.cwd()}/cdn_upload`.replace(/\\/g, '/');
            console.log(`Files were packed for a CDN. ${finalDestination}`);
            process.exit(0);
        });
    } else {
        lastServerProcess = spawn(serverBinary, { stdio: 'inherit' });
    }

    lastServerProcess.once('close', async (code) => {
        console.log(`Server process exited with code ${code}`);
        if (shouldAutoRestart) {
            await handleServerProcess(shouldAutoRestart);
        }
    });
}

async function refreshFileWatching() {
    // unwatch all old files
    for (const filePath in previousGlobFiles) {
        fs.unwatchFile(filePath);
    }

    // grab all new files
    const files = globSync('./src/**/*.ts');

    // ignore `/athena/server` && `/athena/client` directories
    previousGlobFiles = files.filter((fileName) => {
        if (fileName.includes('/athena/server/')) {
            return false;
        }

        if (fileName.includes('/athena/client/')) {
            return false;
        }

        return true;
    });

    for (const filePath of previousGlobFiles) {
        fileNameHashes[filePath] = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
        fs.watch(filePath, (event) => {
            if (event === 'rename' || event === 'change') {
                if (Date.now() < fileWatchTimeout) {
                    return;
                }

                fileWatchTimeout = Date.now() + 2500;

                const current = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
                if (fileNameHashes[filePath] === current) {
                    return;
                }

                devMode(false);
                console.log(`${filePath} has changed, restarting server`);
            }
        });
    }
}

/**
 *
 * @returns {boolean}
 */
async function coreBuildProcess() {
    const timer = createExecTime('>>> Core Build Time');
    const filesUncompiled = await runCoreCompiler();
    if (filesUncompiled.length >= 1) {
        for (let uncompiledFilePath of filesUncompiled) {
            console.log(uncompiledFilePath);
        }

        return false;
    }

    await runPluginsCompiler();
    compileWebviewPlugins();
    copyPluginFiles();
    timer.stop();
    return true;
}

async function devMode(firstRun = false) {
    if (firstRun) {
        await refreshFileWatching();
        return;
    }

    let promises = [];
    promises.push(killChildProcess(lastStreamerProcess));
    promises.push(killChildProcess(lastServerProcess));
    await Promise.all(promises);

    const didCoreBuild = await coreBuildProcess();
    if (!didCoreBuild) {
        return;
    }

    await handleConfiguration();

    await handleStreamerProcess(false);
    await handleServerProcess(false);
}

async function runServer() {
    const isDev = passedArguments.includes('dev');

    // Await updating all the dependencies
    const dependencieTimer = createExecTime(`>>> Update Plugin Dependencies`);
    await updatePluginDependencies();
    dependencieTimer.stop();

    if (isDev) {
        handleViteDevServer();
    }

    // Has to build first before building the rest.
    await coreBuildProcess();
    await handleConfiguration();

    if (passedArguments.includes('dev')) {
        await sleep(50);
        await devMode(true);
        await handleStreamerProcess(false);
        await handleServerProcess(false);
        return;
    }

    await sleep(50);
    await handleStreamerProcess(true);
    await handleServerProcess(true);
}

if (passedArguments.includes('start')) {
    for (const port of ports) {
        try {
            fkill(port, { force: true, ignoreCase: true, silent: true });
        } catch (err) {
            console.log(err);
        }
    }

    runServer();
}
