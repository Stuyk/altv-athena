import * as fs from 'fs';
import * as path from 'path';
import * as alt from 'alt-server';
import { Database, onReady } from 'simplymongo';
import { IAthenaConfig } from '../interface/IAthenaConfig';

let athenaData: IAthenaConfig;

function setupDatabase() {
    // Read `athena.json` configuration file.
    if (!fs.existsSync(`athena.json`)) {
        throw new Error(`athena.json does not exist.`);
    }

    try {
        athenaData = JSON.parse(fs.readFileSync(`athena.json`).toString()) as IAthenaConfig;
    } catch (err) {
        throw new Error(`Could not read JSON data from 'athena.json'`);
    }

    // Setup Database Connection Callback
    onReady(handleOnReadyEvent);

    // Process Default Configuration
    if (athenaData.config) {
        alt.log(`Configuration`);
        Object.keys(athenaData.config).forEach((key) => {
            const data: any = athenaData.config[key];

            alt.log(`${key}: ${data}`);
            process.env[`${key}`] = data;
        });
    }

    // Process Discord Configuration
    if (athenaData.discord) {
        Object.keys(athenaData.discord).forEach((key) => {
            const data: any = athenaData.discord[key];
            process.env[`${key}`] = data;
        });
    }

    // MongoDB Authentication Check
    if (athenaData.username && athenaData.password) {
        new Database(
            athenaData.url,
            athenaData.databaseName,
            athenaData.collections,
            athenaData.username,
            athenaData.password
        );
    } else {
        new Database(athenaData.url, athenaData.databaseName, athenaData.collections);
    }
}

async function handleOnReadyEvent() {
    if (!athenaData.loadOrder) {
        throw new Error('A load order was not specified.');
    }

    if (athenaData.loadOrder.length <= 0) {
        throw new Error(`You did not specify a load order.`);
    }

    // Something about requiring a load order hash...
    for (let i = 0; i < athenaData.loadOrder.length; i++) {
        const filePath: string = path.join('..', athenaData.loadOrder[i]);

        // Handles Windows / Linux Pathing Styles
        if (process.platform.includes('win')) {
            import(filePath.replace(/\\/g, '/'));
        } else {
            import(filePath);
        }
    }
}

setupDatabase();
