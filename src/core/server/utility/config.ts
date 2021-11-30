import * as alt from 'alt-server';
import { IConfig } from '../interface/IConfig';
import fs from 'fs';
import logger from './athenaLogger';
import net from 'net';

const DefaultViteServer = '127.0.0.1';
const DefaultVitePort = 3000;
const DefaultConfigName = 'AthenaConfig.json';
let configCache: IConfig;
let firstRun = true;
let isVueDebugReady = false;

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

        // Process VUE_DEBUG
        if (typeof config.VUE_DEBUG === 'string') {
            config.VUE_DEBUG = config.VUE_DEBUG.toLowerCase() === 'true' ? true : false;
        }

        if (config.VUE_DEBUG) {
            const sock = net.createConnection(DefaultVitePort, DefaultViteServer, () => {
                logger.warning(`Server running in VUE_DEBUG mode.`);
                isVueDebugReady = true;
            });

            sock.once('once', (err) => {
                if (!isVueDebugReady) {
                    logger.warning(`Error while trying to use VUE_DEBUG mode.`);
                    logger.warning(`Please Run: 'npm run vue-dev' in a separate terminal.`);
                } else {
                    logger.warning(`'npm run vue-dev' process was shut down`);
                    logger.warning(`Either restart it or set VUE_DEBUG to false`);
                }

                process.exit(1);
            });
        }

        // Finish Up
        configCache = config;
        firstRun = false;
        return config;
    },
    getViteServer() {
        return `http://${DefaultViteServer}:${DefaultVitePort}`;
    },
};
