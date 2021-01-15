import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { sleep } from '../utility/sleep';

alt.on('connectionComplete', handleConnectionComplete);
alt.onServer(SYSTEM_EVENTS.QUICK_TOKEN_FETCH, handleFetchQT);

async function handleConnectionComplete() {
    native.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
    native.doScreenFadeOut(0);
    native.triggerScreenblurFadeOut(0);
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
