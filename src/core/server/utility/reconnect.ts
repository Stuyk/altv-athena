import * as alt from 'alt-server';
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

        ReconnectHelper.sendRequest();
    }

    private static isWindows(): boolean {
        return process.platform.includes('win');
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
