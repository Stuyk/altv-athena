import * as alt from 'alt-server';
import axios from 'axios';

import Ares from '../utility/ares';

export class PostController {
    static isWindows(): boolean {
        return process.platform.includes('win');
    }

    static async getSecret(): Promise<string | boolean> {
        const sharedSecret = await Ares.getSharedSecret();

        if (!sharedSecret) {
            throw new Error(`Could not get shared secret from Ares. Try rebooting.`);
        }

        return sharedSecret;
    }

    static validateResponse(response: any): boolean {
        if (!response || !response.data || !response.status) {
            if (response.message && response.message.includes('expired')) {
                alt.logError(`[Athena] ${response.message}`);
                process.exit(0);
            }

            if (response.message) {
                alt.logError(`[Athena] ${response.message}`);
                process.exit(0);
            }

            return false;
        }

        return true;
    }

    static async post(route: string, data: any = {}): Promise<any> {
        return await axios
            .post(route, data)
            .then((res) => {
                return res.data;
            })
            .catch(() => {
                return null;
            });
    }
}
