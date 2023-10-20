import * as alt from 'alt-server';
import { IConfig } from '../interface/iConfig.js';
import fs from 'fs';

const DefaultServerCFGName = 'server.toml';
const DefaultVitePort = 3000;
const DefaultConfigName = 'AthenaConfig.json';
const defaultViteServer = 'localhost';
let configCache: IConfig;
let firstRun = true;
let isVueDebug = false;

export async function get(): Promise<IConfig | undefined> {
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
    if (file.includes(`env: "dev"`) || file.includes('env = "dev"')) {
        config.USE_DEV_MODE = true;
    }

    if (file.includes('vue-athena')) {
        isVueDebug = true;
        alt.log(`~c~Vue Server: ~lg~http://${defaultViteServer}:3000`);
    }

    // Finish Up
    configCache = config;
    firstRun = false;
    return config;
}
/**
 * Check if the current server instance is running in dev mode.
 *
 * @return {boolean}
 */
export function isDevMode(): boolean {
    if (!configCache || !configCache.USE_DEV_MODE) {
        return false;
    }

    return configCache.USE_DEV_MODE;
}
export function getViteServer(): string {
    return `http://${defaultViteServer}:${DefaultVitePort}`;
}

export function getVueDebugMode(): boolean {
    return isVueDebug;
}

export function getAthenaVersion(): string {
    const file = fs.readFileSync('package.json').toString();
    let data: { version: string };

    try {
        data = JSON.parse(file);
    } catch (err) {
        alt.logError(`Failed to read package.json. Run your package.json through a JSON linter. Google it.`);
        process.exit(1);
    }

    return data.version;
}

export default { get, isDevMode, getViteServer, getVueDebugMode, getAthenaVersion };
