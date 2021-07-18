import * as alt from 'alt-server';
import axios from 'axios';
import Ares from '../utility/ares';

/**
 * Verifies if the Ares service is up and running.
 * @export
 * @return {*}  {Promise<boolean>}
 */
export async function getEndpointHealth(): Promise<boolean> {
    const endpoint = await Ares.getAresEndpoint();
    const result = await axios.get(`${endpoint}/v1/health`).catch((err) => {
        return null;
    });

    if (!result || !result.data) {
        alt.log(`[Athena] Connecting to Ares`);
        return await getEndpointHealth();
    }

    alt.log(`[Athena] Connected to Ares Successfully`);
    return true;
}
