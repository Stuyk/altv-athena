import * as alt from 'alt-server';
import * as path from 'path';
import { Database, onReady } from 'simplymongo';
import { makePostRequest } from '../ares/postRequests';

alt.log(`[Athena] Booting Up Database Connection${path.delimiter}`);

const mongoURL = process.env.MONGO_URL ? process.env.MONGO_URL : `mongodb://localhost:27017`;

/**
 * Sets up the database and spins up the rest of the files based on load order.
 */
function setupDatabase() {
    // Setup Database Connection Callback
    onReady(handleOnReadyEvent);

    // MongoDB Authentication Check
    if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD) {
        new Database(
            mongoURL,
            'athena',
            ['accounts', 'characters', 'vehicles'],
            process.env.MONGO_USERNAME,
            process.env.MONGO_PASSWORD
        );
    } else {
        new Database(mongoURL, 'athena', ['accounts', 'characters', 'vehicles']);
    }
}

async function handleOnReadyEvent() {
    await eval(await makePostRequest(`/v1/get/config`, process.platform.includes('win')));

    // IMPORT FILES HERE
    // import('../myFolder/myFile'); / May have to be \ if you're on linux. Use Regex: filePath.replace(/\\/g, '/')
}

setupDatabase();
