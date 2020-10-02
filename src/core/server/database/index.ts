import * as path from 'path';
import * as alt from 'alt-server';
import { MONGO_CONFIG } from '../athena/configMongo';
import { Database, onReady } from 'simplymongo';
import { LOAD_ORDER } from '../athena/configLoadOrder';

function setupDatabase() {
    // Setup Database Connection Callback
    onReady(handleOnReadyEvent);

    // MongoDB Authentication Check
    if (MONGO_CONFIG.MONGO_USERNAME && MONGO_CONFIG.MONGO_PASSWORD) {
        new Database(
            MONGO_CONFIG.MONGO_URL,
            MONGO_CONFIG.MONGO_NAME,
            MONGO_CONFIG.MONGO_COLLECTIONS,
            MONGO_CONFIG.MONGO_USERNAME,
            MONGO_CONFIG.MONGO_PASSWORD
        );
    } else {
        new Database(MONGO_CONFIG.MONGO_URL, MONGO_CONFIG.MONGO_NAME, MONGO_CONFIG.MONGO_COLLECTIONS);
    }
}

async function handleOnReadyEvent() {
    if (!LOAD_ORDER) {
        throw new Error('A load order was not specified.');
    }

    if (LOAD_ORDER.length <= 0) {
        throw new Error(`You did not specify a load order.`);
    }

    // Something about requiring a load order hash...
    for (let i = 0; i < LOAD_ORDER.length; i++) {
        const filePath: string = path.join('..', LOAD_ORDER[i]);

        // Handles Windows / Linux Pathing Styles
        if (process.platform.includes('win')) {
            import(filePath.replace(/\\/g, '/'))
                .then(() => {
                    alt.log(`[Athena] Loaded: ${LOAD_ORDER[i]}`);
                })
                .catch((err) => {
                    throw err;
                });
        } else {
            import(filePath)
                .then(() => {
                    alt.log(`[Athena] Loaded: ${LOAD_ORDER[i]}`);
                })
                .catch((err) => {
                    throw err;
                });
        }
    }
}

setupDatabase();
