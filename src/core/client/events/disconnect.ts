import * as alt from 'alt-client';
import * as native from 'natives';

alt.on('disconnect', handleDisconnect);

function handleDisconnect() {
    native.doScreenFadeIn(0);
    native.stopAudioScenes();
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
}
