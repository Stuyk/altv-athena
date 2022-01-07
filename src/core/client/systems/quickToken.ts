import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onServer(SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, updateToken);

/**
 * Update the token in the local storage.
 * @param {string} hash - The hash of the token.
 * @returns None
 */
function updateToken(hash: string) {
    alt.LocalStorage.set('qt', hash);
    alt.LocalStorage.save();
}

/**
 * Fetch the quick token from local storage and emit it to the server.
 * @returns The token.
 */
export async function fetchToken() {
    const qt = alt.LocalStorage.get('qt');

    if (!qt) {
        alt.emitServer(SYSTEM_EVENTS.QUICK_TOKEN_NONE);
        return;
    }

    alt.emitServer(SYSTEM_EVENTS.QUICK_TOKEN_EMIT, qt);
}
