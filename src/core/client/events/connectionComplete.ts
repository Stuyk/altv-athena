import * as alt from 'alt-client';
import * as native from 'natives';
import { Events_Misc } from '../../shared/enums/events';

alt.on('connectionComplete', handleConnectionComplete);
alt.onServer(Events_Misc.FetchQT, handleFetchQT);

async function handleConnectionComplete() {
    native.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
    native.doScreenFadeOut(0);
}

function handleFetchQT() {
    const instance = alt.LocalStorage.get();
    const qt = instance.get('qt');

    if (!qt) {
        return;
    }

    alt.emitServer(Events_Misc.DiscordToken, qt);
}
