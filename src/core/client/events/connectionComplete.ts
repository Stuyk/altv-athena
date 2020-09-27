import * as alt from 'alt-client';
import * as native from 'natives';

alt.on('connectionComplete', handleConnectionComplete);

function handleConnectionComplete() {
    native.doScreenFadeOut(0);
    native.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`)
}

