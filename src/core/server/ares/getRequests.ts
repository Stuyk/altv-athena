import * as alt from 'alt-server';
import axios from 'axios';
import { getAzureEndpoint } from '../utility/encryption'; // Should be able to safely import this.

export async function getEndpointHealth(): Promise<boolean> {
    const result = await axios.get(`${getAzureEndpoint()}/v1/health`).catch((err) => {
        return null;
    });

    if (!result || !result.data) {
        alt.log(`[Athena] Connecting to Ares`);
        return await getEndpointHealth();
    }

    alt.log(`[Athena] Connected to Ares Successfully`);
    return true;
}

export async function getVersionIdentifier(): Promise<string | null> {
    const result = await axios.get(`${getAzureEndpoint()}/v1/get/version`).catch((err) => {
        return null;
    });

    if (!result || !result.data) {
        return null;
    }

    return result.data;
}
