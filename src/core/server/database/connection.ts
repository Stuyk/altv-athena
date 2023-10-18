import * as alt from 'alt-server';
import { Collections } from './collections.js';
import { IConfig } from '../interface/iConfig.js';

// All of these are default values and should not be changed.
const DEFAULT_DATABASE_NAME = 'athena';
const DEFAULT_MONGO_URL = `mongodb://USERNAME:PASSWORD@0.0.0.0:27017`;
const DEFAULT_COLLECTIONS: string[] = [
    Collections.Accounts,
    Collections.Characters,
    Collections.Options,
    Collections.Vehicles,
];

export function getURL(config: IConfig): string {
    if (!config.MONGO_URL) {
        return DEFAULT_MONGO_URL.replace(`USERNAME:PASSWORD@`, '');
    }

    return config.MONGO_URL;
}

export function getCollections(): string[] {
    return DEFAULT_COLLECTIONS;
}

export function getName(config: IConfig): string {
    if (!config.MONGO_DATABASE_NAME) {
        return DEFAULT_DATABASE_NAME;
    }
    return config.MONGO_DATABASE_NAME;
}

export function throwConnectionError() {
    alt.logWarning(`=== ERROR ===`);
    alt.logWarning(`Error Connecting to MongoDB Database. Check your MONGO_URL in AthenaConfig.json`);
    alt.logWarning(`Example: mongodb://username:password@127.0.0.1:27017`);
    alt.logWarning(`Double check that the MongoDB service is running. Use google for more information.`);
    process.exit(1);
}

export default { getCollections, getName, getURL, throwConnectionError };
