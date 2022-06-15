import { ChildProcess, spawn } from 'child_process';
import fkill from 'fkill';
import glob from 'glob';
import fs from 'fs';
import crypto from 'crypto';

const ports = [7788, 'altv-server', 'altv-server.exe', 3399];
const node = 'node';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const serverBinary = process.platform === 'win32' ? 'altv-server.exe' : './altv-server';

const passedArguments = process.argv.slice(2);
const fileNameHashes = {};

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

/**
 * This function waits for a process to be fully killed first.
 * @param {ChildProcess} process
 */
async function killChildProcess(process) {
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

        spawnedProcess.once('error', (err) => {
            console.error(err);
            process.exit(1);
        });
    });
}

async function handleConfiguration() {
    let configName = 'prod';

    if (passedArguments.includes('--dev')) {
        configName = 'dev';
    } else if (passedArguments.includes('--devtest')) {
        configName = 'devtest';
    }

    if (!passedArguments.includes('--dev')) {
        await runFile(npx, 'vite', 'build', './src-webviews');
    }

    await runFile(npx, 'altv-config', `./configs/${configName}.json`);
    await runFile(node, './scripts/buildresource/index.js');
    await runFile(npx, 'altv-config', './scripts/buildresource/resource.json', './resources/core/resource.cfg');
}

async function handleViteDevServer() {
    if (lastViteServer && !lastViteServer.killed) {
        lastViteServer.kill();
    }

    console.log(`===> Starting WebView Process`);
    await runFile(node, './scripts/plugins/webview.js');
    lastViteServer = spawn(
        npx,
        ['vite', './src-webviews', '--clearScreen=false', '--debug=true'],
        { stdio: 'inherit' },
    );

    lastViteServer.once('close', (code) => {
        console.log(`Vite process exited with code ${code}`);
    });

    return await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

function handleStreamerProcess(shouldAutoRestart = false) {
    if (lastStreamerProcess && !lastStreamerProcess.killed) {
        lastStreamerProcess.kill();
    }

    console.log(`===> Starting Streamer Process`);
    lastStreamerProcess = spawn(node, ['./scripts/streamer/dist/index.js'], { stdio: 'inherit' });

    lastStreamerProcess.once('close', (code) => {
        console.log(`Streamer process exited with code ${code}`);
        if (shouldAutoRestart) {
            handleStreamerProcess(shouldAutoRestart)
        }
    });
}

function handleServerProcess(shouldAutoRestart = false) {
    if (lastServerProcess && !lastServerProcess.killed) {
        lastServerProcess.kill();
    }

    console.log(`===> Starting Server Process`);

    if (process.platform !== 'win32') {
        await runFile('chmod', '+x', `./altv-server`);
    }

    lastServerProcess = spawn(serverBinary, { stdio: 'inherit' });

    lastServerProcess.once('close', (code) => {
        console.log(`Server process exited with code ${code}`);
        if (shouldAutoRestart) {
            handleServerProcess(shouldAutoRestart);
        }
    });
}

async function refreshFileWatching() {
    // unwatch all old files
    for (const filePath in previousGlobFiles) {
        fs.unwatchFile(filePath);
    }

    // grab all new files
    const files = glob.sync('./src/**/*.ts');

    // ignore `/athena/server` && `/athena/client` directories 
    previousGlobFiles = files.filter(fileName => {
        if (fileName.includes('\/athena\/server\/')) {
            return false;
        }

        if (fileName.includes('\/athena\/client\/')) {
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

async function devMode(firstRun = false) {
    if (firstRun) {
        await handleViteDevServer();
        await refreshFileWatching();
        return;
    }

    await killChildProcess(lastStreamerProcess);
    await killChildProcess(lastServerProcess);

    await runFile(node, './scripts/compiler/core');
    await runFile(node, './scripts/plugins/core');
    await runFile(node, './scripts/plugins/webview');
    await runFile(node, './scripts/plugins/update-dependencies');
    await handleConfiguration();
    handleStreamerProcess(false);
    handleServerProcess(false);
}

async function runServer() {
    await runFile(node, './scripts/compiler/core');
    await runFile(node, './scripts/plugins/core');
    await runFile(node, './scripts/plugins/webview');
    await runFile(node, './scripts/plugins/update-dependencies');
    await handleConfiguration();

    if (passedArguments.includes('--dev')) {
        await devMode(true);
        handleStreamerProcess(false);
        handleServerProcess(false);
        return;
    }

    handleStreamerProcess(true);
    handleServerProcess(true);
}

if (passedArguments.includes('--start')) {
    for (const port of ports) {
        try {
            fkill(port, { force: true, ignoreCase: true, silent: true });
        } catch (err) {
            console.log(err);
        }
    }

    runServer();
}