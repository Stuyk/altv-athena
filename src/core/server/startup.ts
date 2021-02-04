import * as alt from 'alt-server';
import path from 'path';
import fs from 'fs';
import env from 'dotenv';
import { InjectedFunctions, InjectedStarter, loadWASM } from './utility/wasmLoader';
import { setAzureEndpoint } from './utility/encryption';
import { getEndpointHealth, getVersionIdentifier } from './ares/getRequests';
import { SYSTEM_EVENTS } from '../shared/enums/system';
import logger from './utility/athenaLogger';
import { Collections } from './interface/DatabaseCollections';
import isFunction from '../shared/utility/classCheck';

env.config();

setAzureEndpoint(process.env.ENDPOINT ? process.env.ENDPOINT : 'https://ares.stuyk.com');

const mongoURL = process.env.MONGO_URL ? process.env.MONGO_URL : `mongodb://localhost:27017`;
const fPath = `${path.join(alt.getResourcePath(alt.resourceName), '/server/athena.wasm')}`;
const buffer = fs.readFileSync(fPath);
const collections = [
    //
    Collections.Accounts,
    Collections.Characters,
    Collections.Options
];

let fns: InjectedFunctions;

alt.on('playerConnect', handleEarlyConnect);
alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, handleEntryToggle);

if (!process.env.GUMROAD) {
    logger.error('Failed to retrieve GUMROAD from your .env file.');
    logger.log(`Visit: https://athena.stuyk.com/documentation/installing-athena`);
    process.exit(0);
}

if (!process.env.EMAIL) {
    logger.error('Failed to retrieve EMAIL from your .env file.');
    logger.log(`Visit: https://athena.stuyk.com/documentation/installing-athena`);
    process.exit(0);
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
            if (module.default && isFunction(module.default)) {
                module.default();
            }

            if (module.load && isFunction(module.load)) {
                module.default();
            }

            return true;
        });

    if (!imported) {
        logger.error(`Failed to load.`);
        return false;
    }

    return await loadFiles();
}

async function handleFiles() {
    const result = await loadFiles();
    if (!result) {
        logger.error(`Failed to load files.`);
        process.exit(0);
    }

    import('./utility/console');

    import('./systems/options').then((res) => {
        res.default();
    });

    import('./systems/discord').then((res) => {
        res.default();
    });

    import('../extra/imports').then((res) => {
        res.default();
    });
}

async function runBooter() {
    await getEndpointHealth(); // Verify Endpoint is Up
    const version = await getVersionIdentifier();

    if (!version) {
        logger.error(`Unable to verify the version of Athena. Try rebooting.`);
        process.exit(0);
    }

    logger.info(`Version: ${process.env.ATHENA_VERSION}`);
    if (version !== process.env.ATHENA_VERSION) {
        logger.warning(`--- Version Warning ---`);
        logger.warning(`Your server may be out of date. Please update your server.`);
        logger.warning(`Please pull down the latest changes from the official repository.`);
        logger.warning(`Try merging from the master branch or from the upstream branch of your choice.`);
    }

    const starterFns = await loadWASM<InjectedStarter>('starter', buffer);
    const aresBuffer = await starterFns.start().catch((err) => {
        return null;
    });

    if (!aresBuffer) {
        logger.error(`Unable to boot. Potentially invalid license.`);
        process.exit(0);
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
    logger.info(`Server Warmup Complete. Now accepting connections.`);
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
    logger.error(`[Athena] Could not fetch version from package.json. Is there a package.json?`);
    process.exit(0);
}
