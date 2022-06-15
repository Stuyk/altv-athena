import { ChildProcess, spawn } from 'child_process';

const node = 'node';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const serverBinary = process.platform === 'win32' ? 'altv-server.exe' : 'altv-server';

const passedArguments = process.argv.slice(2);

/**
 * This is the alt:V Server Process
 * @type {ChildProcess} */
let lastServerProcess;

/**
 * This is the Streamer Server Process
 * @type {ChildProcess} */
let lastStreamerProcess;

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

function handleStreamerProcess() {
    console.log(`Starting Streamer Process`);
    lastStreamerProcess = spawn(node, ['./scripts/streamer/dist/index.js'], { stdio: 'inherit' });

    lastStreamerProcess.once('close', (code) => {
        console.log(`Streamer process exited with code ${code}`);
        handleStreamerProcess();
    });
}

function handleServerProcess() {
    console.log(`Starting Server Process`);
    lastServerProcess = spawn(serverBinary, { stdio: 'inherit' });

    lastServerProcess.once('close', (code) => {
        console.log(`Server process exited with code ${code}`);
        runServer();
    });
}

async function runServer() {
    await runFile(node, './scripts/compiler/core');
    await runFile(node, './scripts/plugins/core');
    await runFile(node, './scripts/plugins/webview');
    await runFile(node, './scripts/plugins/update-dependencies');
    await handleConfiguration();

    handleStreamerProcess();
    handleServerProcess();
}

if (passedArguments.includes('--start')) {
    runServer();
}
