import * as alt from 'alt-server';
import { IConfig } from '../interface/IConfig';
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

        // Process WEBSERVER_IP
        if (config.WEBSERVER_IP === '' && !alt.hasResource('webserver')) {
            config.WEBSERVER_IP = '127.0.0.1:9111';

            if (firstRun) {
                logger.warning(`Reminder that you are using development mode for distributing files.`);
                logger.warning(`Please add 'webserver' as a resource when running in production mode.`);
            }
        }

        const file = fs.readFileSync(DefaultServerCFGName).toString();
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
    getViteServer() {
        return `http://${DefaultViteServer}:${DefaultVitePort}`;
    },
    getVueDebugMode() {
        return isVueDebug;
    },
};
