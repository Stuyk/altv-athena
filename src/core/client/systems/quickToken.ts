import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onServer(SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, updateToken);

function updateToken(hash: string) {
    alt.LocalStorage.set('qt', hash);
    alt.LocalStorage.save();
}

export async function fetchToken() {
    const qt = alt.LocalStorage.get('qt');

    if (!qt) {
        alt.emitServer(SYSTEM_EVENTS.QUICK_TOKEN_NONE);
        return;
    }

    alt.emitServer(SYSTEM_EVENTS.QUICK_TOKEN_EMIT, qt);
}
