import * as alt from 'alt-server';
import dotenv from 'dotenv';
import { getEndpointHealth, getVersionIdentifier } from '../ares/getRequests';
import { makePostRequest } from '../ares/postRequests';
import { setAzureEndpoint } from '../utility/encryption';

dotenv.config(); // Reads `.env` variables if present.

setAzureEndpoint(process.env.ENDPOINT ? process.env.ENDPOINT : 'https://altv-athena-discord.azurewebsites.net');

if (!process.env.GUMROAD) {
    alt.logError(`[Athena] Failed to get GUMROAD key from .env file. Visit https://gum.co/SKpPN for more information.`);
    process.exit(1);
}

if (!process.env.EMAIL) {
    alt.logError(`[Athena] Failed to get EMAIL from .env file. Visit https://gum.co/SKpPN for more information.`);
    process.exit(1);
}

(async () => {
    await getEndpointHealth();

    const version = await getVersionIdentifier();

    if (!version) {
        return null;
    }

    if (version !== process.env.ATHENA_VERSION) {
        alt.logWarning(`--- Version Warning ---`);
        alt.logWarning(`[Athena] Your server may be out of date. Please update your server.`);
        alt.logWarning(`[Athena] Please pull down the latest changes from the official repository.`);
    }

    const bootResult = await makePostRequest(`/v1/post/import`, process.platform.includes('win'));
    if (!bootResult) {
        alt.logError(`[Athena] Invalid Key. Shutting down.`);
        process.exit(0);
    }

    alt.logWarning(`[Athena] Key was validated.`);
    await eval(bootResult);
})();
