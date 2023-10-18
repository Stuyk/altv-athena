import * as alt from 'alt-client';
import { DiscordAuthEvents } from '../shared/events.js';

async function getDiscordToken(applicationIdentifier: string) {
    let bearerToken: string;

    try {
        bearerToken = await alt.Discord.requestOAuth2Token(applicationIdentifier);
    } catch (err) {}

    alt.emitServer(DiscordAuthEvents.toServer.pushToken, bearerToken);
}

alt.onServer(DiscordAuthEvents.toClient.requestToken, getDiscordToken);
