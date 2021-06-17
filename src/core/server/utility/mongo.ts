import { Collections } from '../interface/DatabaseCollections';
import { IConfig } from '../interface/IConfig';

// Leave these alone. Learn to use the .env file.
// All of these are default values and should not be changed.
const DEFAULT_DATABASE_NAME = 'athena';
const DEFAULT_MONGO_URL = `mongodb://USERNAME:PASSWORD@localhost:27017`;
const DEFAULT_COLLECTIONS: string[] = [
    Collections.Accounts,
    Collections.Characters,
    Collections.Options,
    Collections.Interiors
];

export default {
    getURL: (config: IConfig): string => {
        if (config.MONGO_USERNAME && config.MONGO_PASSWORD && !config.MONGO_URL) {
            return DEFAULT_MONGO_URL.replace('USERNAME', config.MONGO_USERNAME).replace(
                'PASSWORD',
                config.MONGO_PASSWORD
            );
        } else if (!config.MONGO_URL) {
            return DEFAULT_MONGO_URL.replace('USERNAME:PASSWORD@', '');
        }

        return config.MONGO_URL;
    },
    getCollections: (config: IConfig): string[] => {
        if (config.MONGO_COLLECTIONS) {
            return DEFAULT_COLLECTIONS.concat(config.MONGO_COLLECTIONS.replace(/\s/g, '').split(','));
        }

        return DEFAULT_COLLECTIONS;
    },
    getName: (): string => {
        return DEFAULT_DATABASE_NAME;
    },
    throwConnectionError: () => {
        console.log(`=== ERROR ===`);
        console.log(`Failed to initialize connection to MongoDB Database. Check your Environment Variables.`);
        console.log(`MONGO_USERNAME -> Could be incorrect.`);
        console.log(`MONGO_PASSWORD -> Could be incorrect.`);
        console.log(`MONGO_URL -> Could be incorrect.`);
        console.log(`Preferrably only use 'MONGO_URL' if you are using an authenticated database for connections.`);
        console.log(`Double check that the MongoDB service is running. Use google for more information.`);
        process.exit(1);
    }
};
