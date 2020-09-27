import * as alt from 'alt-client';
import * as native from 'natives';

alt.on('disconnect', handleDisconnect);

function handleDisconnect() {
    native.doScreenFadeIn(0);
    native.stopAudioScenes();
}

