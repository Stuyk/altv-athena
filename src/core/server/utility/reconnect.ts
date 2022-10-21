import * as alt from 'alt-server';
import ConfigUtil from './config';
import axios from 'axios';

export const ReconnectHelper = {
    invoke() {
        if (!ConfigUtil.get().USE_ALTV_RECONNECT) {
            return;
        }

        if (!ReconnectHelper.isWindows()) {
            return;
        }

        ReconnectHelper.reconnect();
    },
    isWindows(): boolean {
        return process.platform.includes('win');
    },
    async reconnect() {
        const result = await axios.get('http://127.0.0.1:9223/status').catch((err) => {
            return undefined;
        });

        if (typeof result === 'undefined' || !result.data) {
            return;
        }

        if (result.data === 'MAIN_MENU' || result.data === 'IN_GAME') {
            axios.get('http://127.0.0.1:9223/reconnect');
        } else {
            alt.setTimeout(ReconnectHelper.reconnect, 1000);
        }
    },
};
