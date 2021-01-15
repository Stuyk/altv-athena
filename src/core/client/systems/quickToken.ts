import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { sleep } from '../utility/sleep';

alt.onServer(SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, handleUpdateToken);
alt.onServer(SYSTEM_EVENTS.QUICK_TOKEN_FETCH, handleFetchQT);

function handleUpdateToken(hash: string) {
    const instance = alt.LocalStorage.get();
    instance.set('qt', hash);
    instance.save();
}

async function handleFetchQT() {
    const instance = alt.LocalStorage.get();
    const qt = instance.get('qt');

    if (!qt) {
        alt.emitServer(SYSTEM_EVENTS.QUICK_TOKEN_NONE);
        return;
    }

    await sleep(250);

    alt.emitServer(SYSTEM_EVENTS.QUICK_TOKEN_EMIT, qt);
}
