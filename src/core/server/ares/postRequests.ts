import * as alt from 'alt-server';
import axios from 'axios';
import { decryptData, getAzureEndpoint, getSharedSecret } from '../utility/encryption'; // Should be able to safely import this.
import { generatePosterFormat } from './shared';

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
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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

        return await makePostRequest(url, isWindows, dataObject);
    }

    alt.log(`[Athena] Your Gumroad API Key was validated. Booting script.`);
    const endResult = await decryptData(result.data);
    return endResult;
}
