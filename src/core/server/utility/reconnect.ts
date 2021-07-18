import * as alt from 'alt-server';
import * as http from 'http';
import fs from 'fs';

const RECONNECTION_ADDRESS = 'http://localhost:9229/reconnect'; // http://localhost:9229/reconnect/debug
const VALID_RECONNECT_STRINGS = ['debug: true', 'debug:true'];
const TIME_BETWEEN_CHECKS = 5000;
const CFG = fs.readFileSync('server.cfg').toString();

let isWaitingForReconnect = false;
let interval;

export class ReconnectHelper {
    /**
     * Call this function to invoke reconnection after everything in your
     * server has loaded.
     * @static
     * @return {*}
     * @memberof ReconnectHelper
     */
    static invoke() {
        if (!ReconnectHelper.isWindows()) {
            return;
        }

        for (let i = 0; i < VALID_RECONNECT_STRINGS.length; i++) {
            const isValid = ReconnectHelper.isValidReconnectionString(CFG, VALID_RECONNECT_STRINGS[i]);
            if (!isValid) {
                continue;
            }

            isWaitingForReconnect = true;
            break;
        }

        // Not Running Reconnection Mode
        if (!isWaitingForReconnect) {
            alt.log(`Not Running Reconnection Mode. Add: 'debug: true' to your server.cfg`);
            return;
        }

        // Invoke the Reconnection Request
        alt.once('playerConnect', ReconnectHelper.clearRequest);
        interval = alt.setInterval(ReconnectHelper.sendRequest, TIME_BETWEEN_CHECKS);
        ReconnectHelper.sendRequest();
    }

    private static isWindows(): boolean {
        return process.platform.includes('win');
    }

    private static isValidReconnectionString(cfg: string, testString: string): boolean {
        return cfg.toLowerCase().includes(testString);
    }

    private static clearRequest() {
        alt.clearInterval(interval);
        isWaitingForReconnect = false;
        alt.log(`[altv-reconnect] Finished Reconnection`);
    }

    private static sendRequest() {
        const req = http.get(RECONNECTION_ADDRESS);
        req.on('error', () => {
            alt.log(`[altv-reconnect] Probably Not Running Reconnection Script`);
            alt.clearInterval(interval);
            isWaitingForReconnect = false;
        });
    }
}
