import * as path from 'path';
import * as alt from 'alt-server';
import { MONGO_CONFIG } from '../athena/configMongo';
import { Database, onReady } from 'simplymongo';
import { LOAD_ORDER } from '../athena/configLoadOrder';
import { sha256 } from '../utility/encryption';

/**
 * Sets up the database and spins up the rest of the files based on load order.
 */
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

/**
 * Loads all files based on load order.
 * Load order is very important and there are a handful of files that must be loaded first.
 */
async function handleOnReadyEvent() {
    if (!LOAD_ORDER) {
        throw new Error('A load order was not specified. 0 elements in athena/configLoadOrder.ts');
    }

    if (LOAD_ORDER.length <= 0) {
        throw new Error(`You did not specify a load order. 0 elements in athena/configLoadOrder.ts`);
    }

    if (sha256(LOAD_ORDER[0]) !== '653116fbecbfdf6c94eca33f68403f864f25bdc61b929631da110884962d6817') {
        throw new Error(`Line 0 in load order is not the correct file name. athena/configLoadOrder.ts`);
    }

    if (sha256(LOAD_ORDER[1]) !== '6e442997d879b0ec10500edd458c8daea733e0093702806993abb73be3e40729') {
        throw new Error(`Line 1 in load order is not the correct file name. athena/configLoadOrder.ts`);
    }

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
