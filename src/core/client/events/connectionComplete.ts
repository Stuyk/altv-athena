import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.on('connectionComplete', handleConnectionComplete);
alt.onServer(SYSTEM_EVENTS.TICKS_START, handleTick);

async function handleConnectionComplete() {
    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, 0);
    native.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
    native.doScreenFadeIn(0);
    native.triggerScreenblurFadeOut(0);
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    alt.emitServer(SYSTEM_EVENTS.CHECK_CONNECTION);
}

function handleTick() {
    native.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
}
