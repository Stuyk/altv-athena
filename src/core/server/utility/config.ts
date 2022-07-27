import * as alt from 'alt-server';
import { IConfig } from '../interface/iConfig';
import fs from 'fs';
import net from 'net';

const DefaultServerCFGName = 'server.cfg';
const DefaultViteServer = '127.0.0.1';
const DefaultVitePort = 3000;
const DefaultConfigName = 'AthenaConfig.json';
let configCache: IConfig;
let firstRun = true;
let isVueDebug = false;

export default {
    get: (): IConfig | undefined => {
        // Return the cached config to prevent reading twice.
        if (configCache) {
            return configCache;
        }

        // Fetch the configuration
        if (!fs.existsSync(DefaultConfigName)) {
            alt.logWarning(`${DefaultConfigName} does not exist in root directory.`);
            alt.logWarning(`Please get ${DefaultConfigName} from default server files.`);
            process.exit(1);
        }

        let config: IConfig;

        try {
            config = JSON.parse(fs.readFileSync(DefaultConfigName).toString());
        } catch (err) {
            alt.logWarning(`${DefaultConfigName} has formatting errors.`);
            alt.logWarning(`Please use https://jsonlint.com/ to verify your configuration.`);
            process.exit(1);
        }

        const file = fs.readFileSync(DefaultServerCFGName).toString();
        if (file.includes(`env: "dev"`)) {
            config.USE_DEV_MODE = true;
        }

        if (file.includes('vue-athena')) {
            try {
                const sock = net.createConnection(DefaultVitePort, DefaultViteServer, () => {
                    alt.logWarning(`Server running with Vue Debug mode on.`);
                    alt.logWarning(`Open http://localhost:3000 in your browser`);
                    alt.logWarning(`Only a local player may connect.`);
                    alt.logWarning(`Server MUST be running on a local computer`);
                    isVueDebug = true;
                    sock.destroy();
                });
            } catch (err) {
                alt.logWarning(``);
            }
        }

        // Finish Up
        configCache = config;
        firstRun = false;
        return config;
    },
    /**
     * Check if the current server instance is running in dev mode.
     *
     * @return {boolean}
     */
    isDevMode(): boolean {
        if (!configCache || !configCache.USE_DEV_MODE) {
            return false;
        }

        return configCache.USE_DEV_MODE;
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
