import * as alt from 'alt-server';
import path from 'path';
import fs from 'fs';
import env from 'dotenv';
import { InjectedFunctions, InjectedStarter, loadWASM } from './utility/wasmLoader';
import { setAzureEndpoint } from './utility/encryption';
import { getEndpointHealth, getVersionIdentifier } from './ares/getRequests';
import { SYSTEM_EVENTS } from '../shared/enums/system';

env.config();

setAzureEndpoint(process.env.ENDPOINT ? process.env.ENDPOINT : 'https://ares.stuyk.com');

const mongoURL = process.env.MONGO_URL ? process.env.MONGO_URL : `mongodb://localhost:27017`;
const collections = ['accounts', 'characters', 'vehicles'];
const fPath = `${path.join(alt.getResourcePath(alt.resourceName), '/server/athena.wasm')}`;
const buffer = fs.readFileSync(fPath);

let fns: InjectedFunctions;

alt.on('playerConnect', handleEarlyConnect);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, handleEntryToggle);

if (!process.env.GUMROAD || !process.env.EMAIL) {
    alt.logWarning(`[Athena] Failed to get GUMROAD/EMAIL from .env file. Visit https://gum.co/SKpPN to buy one.`);
    process.exit(1);
}

async function loadFiles(): Promise<boolean> {
    if (fns.idl()) {
        return true;
    }

    const imported = await fns
        .ii()
        .catch((err) => {
            return null;
        })
        .then((module) => {
            if (module.load) {
                module.load();
            }

            return true;
        });

    if (!imported) {
        alt.logError(`[Athena] Failed to load.`);
        return false;
    }

    return await loadFiles();
}

async function handleFiles() {
    const result = await loadFiles();
    if (!result) {
        alt.logError('[Athena] Failed to load files.');
        process.exit(1);
    }

    alt.log('[Athena] Warmup Complete. Finishing loading.');
}

async function runBooter() {
    await getEndpointHealth(); // Verify Endpoint is Up
    const version = await getVersionIdentifier();

    if (!version) {
        alt.logError('[Ares] Unable to get version. Try rebooting.');
        process.exit(1);
    }

    alt.log(`[Athena] Version: ${process.env.ATHENA_VERSION}`);
    if (version !== process.env.ATHENA_VERSION) {
        alt.logWarning(`--- Version Warning ---`);
        alt.log(`[Athena] Your server may be out of date. Please update your server.`);
        alt.log(`[Athena] Please pull down the latest changes from the official repository.`);
        alt.log(`[Athena] Try running: 'git pull origin master'`);
    }

    const starterFns = await loadWASM<InjectedStarter>('starter', buffer);
    const aresBuffer = await starterFns.start().catch((err) => {
        return null;
    });

    if (!aresBuffer) {
        alt.logError('[Ares] Unable to boot. Potentially bad license.');
        process.exit(1);
    }

    fns = await loadWASM<InjectedFunctions>('ares', aresBuffer).catch((err) => {
        try {
            const data = JSON.parse(aresBuffer);
            alt.logError(`Status: ${data.status} | Error: ${data.message}`);
        } catch (err) {}
        return null;
    });

    if (!fns) {
        return;
    }

    fns.bd(mongoURL, collections, handleFiles);
}

function handleEntryToggle() {
    alt.off('playerConnect', handleEarlyConnect);
    alt.log(`[Athena] Server Warmup Complete. Now taking connections.`);
}

/**
 * Prevent early connections until server is warmed up.
 * @param {alt.Player} player
 * @return {*}  {void}
 */
function handleEarlyConnect(player: alt.Player): void {
    if (!(player instanceof alt.Player) || !player || !player.valid) {
        return;
    }

    try {
        player.kick('[Athena] Connected too early. Server still warming up.');
    } catch (err) {
        alt.log(`[Athena] A reconnection event happened too early. Try again.`);
    }
}

try {
    const result = fs.readFileSync('package.json').toString();
    const data = JSON.parse(result);
    process.env.ATHENA_VERSION = data.version;
    runBooter();
} catch (err) {
    alt.logWarning(`[Athena] Could not fetch version from package.json. Is there a package.json?`);
    process.exit(1);
}
