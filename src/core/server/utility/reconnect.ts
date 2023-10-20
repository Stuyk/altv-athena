import * as alt from 'alt-server';
import * as config from './config.js';
import axios from 'axios';

export async function invoke() {
    const someConfig = await config.get();

    if (!someConfig.USE_ALTV_RECONNECT) {
        return;
    }

    if (!isWindows()) {
        return;
    }

    reconnect();
}

export function isWindows(): boolean {
    return process.platform.includes('win');
}

export async function reconnect() {
    const result = await axios.get('http://127.0.0.1:9223/status').catch((err) => {
        return undefined;
    });

    if (typeof result === 'undefined' || !result.data) {
        return;
    }

    if (result.data === 'MAIN_MENU' || result.data === 'IN_GAME') {
        axios.get('http://127.0.0.1:9223/reconnect');
    } else {
        alt.setTimeout(reconnect, 1000);
    }
}

export default { invoke, isWindows, reconnect };
