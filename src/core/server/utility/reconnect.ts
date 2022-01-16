import * as alt from 'alt-server';
import fetch from 'node-fetch';
import * as http from 'http';
import ConfigUtil from './config';

const RECONNECTION_ADDRESS = 'http://localhost:5599';
let caughtErrorOnce = false;

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

        const [major, minor] = alt.version.split('.');
        if (parseInt(major) >= 9) {
            console.log(`Using built-in reconnect strategy`);
            this.altvReconnect();
            return;
        }

        console.log(`Using Old Reconnect Strategy`);
        // Use altv-reconnect strategy
        ReconnectHelper.sendRequest();
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

    private static sendRequest() {
        const req = http.get(RECONNECTION_ADDRESS);
        req.on('response', () => {
            alt.log(`~g~[altv-reconnect] Invoked Reconnection Successfully`);
        });

        req.on('error', () => {
            if (caughtErrorOnce) {
                return;
            }

            caughtErrorOnce = true;
            alt.log(`~r~[altv-reconnect] ~y~Not Currently Running`);
            alt.log(`~r~[altv-reconnect] ~y~Download Binaries from https://github.com/Stuyk/altv-reconnect`);
            alt.log(`~r~[altv-reconnect] ~y~Turn off 'USE_ALTV_RECONNECT' if in production mode`);
        });
    }
}
