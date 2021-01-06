import * as alt from 'alt-server';
import axios from 'axios';
import { decryptData, getAzureEndpoint, getSharedSecret } from '../utility/encryption'; // Should be able to safely import this.
import { generatePosterFormat } from './shared';

/**
 * Used to make an encrytped REST 'POST' Request to the Ares Service.
 * @export
 * @param {string} url
 * @param {boolean} [isWindows=false]
 * @param {any} [dataObject={}]
 * @return {Promise<string>}  {Promise<string>}
 */
export async function makePostRequest(url: string, isWindows: boolean = false, dataObject: any = {}): Promise<string> {
    const sharedSecret = await getSharedSecret();

    if (!sharedSecret) {
        return await makePostRequest(url, isWindows, dataObject);
    }

    const responseParms = new URLSearchParams();
    const postData = await generatePosterFormat({ isWindows, ...dataObject });
    responseParms.append('data', JSON.stringify(postData));

    const result = await axios
        .post(`${getAzureEndpoint()}${url}`, responseParms, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            responseType: 'arraybuffer'
        })
        .catch((err) => {
            alt.log(err);
            return null;
        });

    if (!result || !result.data || !result.status) {
        if (result.message && result.message.includes('expired')) {
            alt.logError(`[Athena] ${result.message}`);
            process.exit(0);
        }

        if (result.message) {
            alt.logError(`[Athena] ${result.message}`);
            process.exit(0);
        }

        return await makePostRequest(url, isWindows, dataObject);
    }

    const decrypted = await decryptData(result.data);
    if (!decrypted) {
        return result.data;
    }

    return decrypted;
}
