import { ChildProcess, spawn } from 'child_process';
import fkill from 'fkill';
import glob from 'glob';
import fs from 'fs';
import crypto from 'crypto';

const NO_SPECIAL_CHARACTERS = new RegExp(/^[ A-Za-z0-9_-]*$/gm);

const ports = [7788, 'altv-server', 'altv-server.exe', 3399, 3001];
const node = 'node';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const serverBinary = process.platform === 'win32' ? 'altv-server.exe' : './altv-server';

const passedArguments = process.argv.slice(2).map(arg => arg.replace('--', ''));
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

    console.log(`===> Starting Configuration Build`);
    const start = Date.now();
    let promises = [];

    if (!passedArguments.includes('dev')) {
        promises.push(runFile(npx, 'vite', 'build', './src-webviews'));
    }

    promises.push(runFile(npx, 'altv-config', `./configs/${configName}.json`));
    await runFile(node, './scripts/buildresource/index.js');
    promises.push(
        runFile(npx, 'altv-config', './scripts/buildresource/resource.json', './resources/core/resource.cfg'),
    );
    console.log(`===> Finished Configuration Build (${Date.now() - start}ms)`);
    return await Promise.all(promises);
}

async function handleViteDevServer() {
    if (lastViteServer && !lastViteServer.killed) {
        lastViteServer.kill();
    }

    console.log(`===> Starting Vite Server`);
    await runFile(node, './scripts/plugins/webview.js');
    lastViteServer = spawn(npx, ['vite', './src-webviews', '--clearScreen=false', '--debug=true'], {
        stdio: 'inherit',
    });

    lastViteServer.once('close', (code) => {
        console.log(`Vite process exited with code ${code}`);
    });

    console.log(`===> Started Vite Server`);
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
            handleStreamerProcess(shouldAutoRestart);
        }
    });
}

async function handleServerProcess(shouldAutoRestart = false) {
    if (lastServerProcess && !lastServerProcess.killed) {
        lastServerProcess.kill();
    }

    console.log(`===> Starting Server Process`);

    if (process.platform !== 'win32') {
        await runFile('chmod', '+x', `./altv-server`);
    }

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

async function coreBuildProcess() {
    console.log('===> Starting Core Build');
    const start = Date.now();
    await runFile(node, './scripts/compiler/core');
    await runFile(node, './scripts/plugins/core');
    await runFile(node, './scripts/plugins/webview');
    console.log(`===> Finished Core Build (${Date.now() - start}ms)`);
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
    promises = [];

    promises.push(coreBuildProcess());
    promises.push(handleConfiguration());

    await Promise.all(promises);

    handleStreamerProcess(false);
    handleServerProcess(false);
}

async function runServer() {
    const isDev = passedArguments.includes('dev');

    //Update dependencies for all the things
    console.log('===> Updating dependencies for plugins');
    await runFile(node, './scripts/plugins/update-dependencies');

    if (isDev) {
        await handleViteDevServer();
    }

    // Has to build first before building the rest.
    await coreBuildProcess();
    await handleConfiguration();

    if (passedArguments.includes('dev')) {
        await sleep(50);
        await devMode(true);
        handleStreamerProcess(false);
        handleServerProcess(false);
        return;
    }

    await sleep(50);
    handleStreamerProcess(true);
    handleServerProcess(true);
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
    process.stdin.on('data', (data) => {
        const result = data.toString().trim();
        if (result.charAt(0) !== '+' && result.charAt(0) !== '/') {
            console.log(`Use +help to see server maintenance commands. (This Console)`);
            console.log(`Use /commands to see server magagement commands. (The Game Console)`);
            if (!lastServerProcess.killed) {
                return;
            }

            lastServerProcess.send(data);
            return;
        }

        const inputs = result.split(' ');
        const cmdName = inputs.shift();
        console.log(cmdName, ...inputs);
    });
}
