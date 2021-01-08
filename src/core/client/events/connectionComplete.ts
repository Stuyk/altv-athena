import * as alt from 'alt-client';
import * as native from 'natives';

alt.on('connectionComplete', handleConnectionComplete);

function handleConnectionComplete() {
    native.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
    native.doScreenFadeOut(0);

    alt.addGxtText('FE_THDR_GTAO', `ID: ${alt.Player.local.id} | PLAYERS: ${alt.Player.all.length}`);
}
