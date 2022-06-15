import * as alt from 'alt-server';
import ConfigUtil from './config';
import axios from 'axios';

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

    private static async altvReconnect() {
        const result = await axios.get('http://127.0.0.1:9223/status').catch((err) => {
            return null;
        });

        if (!result || !result.data) {
            return;
        }

        if (result.data === 'MAIN_MENU' || result.data === 'IN_GAME') {
            axios.get('http://127.0.0.1:9223/reconnect');
        } else {
            alt.setTimeout(this.altvReconnect, 1000);
        }
    }
}
