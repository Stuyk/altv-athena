import * as alt from 'alt-server';
import { IConfig } from '../interface/iConfig';
import fs from 'fs';
import logger from './athenaLogger';
import net from 'net';

const DefaultServerCFGName = 'server.cfg';
const DefaultViteServer = '127.0.0.1';
const DefaultVitePort = 3000;
const DefaultConfigName = 'AthenaConfig.json';
let configCache: IConfig;
let firstRun = true;
let isVueDebug = false;

export default {
    get: (): IConfig | null => {
        // Return the cached config to prevent reading twice.
        if (configCache) {
            return configCache;
        }

        // Fetch the configuration
        if (!fs.existsSync(DefaultConfigName)) {
            logger.warning(`${DefaultConfigName} does not exist in root directory.`);
            logger.warning(`Please get ${DefaultConfigName} from default server files.`);
            process.exit(1);
        }

        let config: IConfig;

        try {
            config = JSON.parse(fs.readFileSync(DefaultConfigName).toString());
        } catch (err) {
            logger.warning(`${DefaultConfigName} has formatting errors.`);
            logger.warning(`Please use https://jsonlint.com/ to verify your configuration.`);
            process.exit(1);
        }

        const file = fs.readFileSync(DefaultServerCFGName).toString();
        if (file.includes(`env: "dev"`)) {
            console.log(`USING DEV MODE`);
            config.USE_DEV_MODE = true;
        }

        if (file.includes('vue-athena')) {
            try {
                const sock = net.createConnection(DefaultVitePort, DefaultViteServer, () => {
                    logger.warning(`Server running with Vue Debug mode on.`);
                    logger.warning(`Open http://localhost:3000 in your browser`);
                    logger.warning(`Only a local player may connect.`);
                    logger.warning(`Server MUST be running on a local computer`);
                    isVueDebug = true;
                    sock.destroy();
                });
            } catch (err) {
                logger.warning(``);
            }
        }

        // Finish Up
        configCache = config;
        firstRun = false;
        return config;
    },
    getViteServer(): string {
        return `http://${DefaultViteServer}:${DefaultVitePort}`;
    },
    getVueDebugMode(): boolean {
        return isVueDebug;
    },
    getAthenaVersion(): string {
        const file = fs.readFileSync('package.json').toString();
        let data: { version: string };

        try {
            data = JSON.parse(file);
        } catch (err) {
            console.warn(`Failed to read package.json. Run your package.json through a JSON linter. Google it.`);
            process.exit(1);
        }

        return data.version;
    },
};
