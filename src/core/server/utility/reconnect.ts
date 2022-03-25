import * as alt from 'alt-server';
import fetch from 'node-fetch';
import ConfigUtil from './config';

export class ReconnectHelper {
    /**
     * Call this function to invoke reconnection after everything in your
     * server has loaded.
     * @static
     * @return {*}
     * @memberof ReconnectHelper
     */
    static invoke() {
        if (!ConfigUtil.get().USE_ALTV_RECONNECT) {
            return;
        }

        if (!ReconnectHelper.isWindows()) {
            return;
        }

        this.altvReconnect();
    }

    private static isWindows(): boolean {
        return process.platform.includes('win');
    }

    private static altvReconnect() {
        fetch('http://127.0.0.1:9223/status')
            .then(async (res) => {
                const body = await res.text();
                if (body == 'MAIN_MENU' || body == 'IN_GAME') {
                    fetch('http://127.0.0.1:9223/reconnect');
                } else {
                    alt.setTimeout(this.altvReconnect, 3000);
                }
            })
            .catch(alt.log);
    }
}
