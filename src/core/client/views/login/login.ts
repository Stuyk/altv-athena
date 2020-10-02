import * as alt from 'alt-client';
import * as native from 'natives';
import { View_Events_Discord } from '../../../shared/enums/views';
import { View } from '../../extensions/view';

const url = `http://resource/client/views/login/html/index.html`;
let view: View;
let discordURI: string;

alt.onServer(View_Events_Discord.Auth, handleView);
alt.onServer(View_Events_Discord.Close, handleClose);

async function handleView(oAuthUrl) {
    discordURI = oAuthUrl;

    if (!view) {
        view = await View.getInstance(url, true);
        view.on('discord:OpenURL', handleOpenURL);
    }
}

function handleOpenURL() {
    view.emit('discord:OpenURL', discordURI);
}

function handleClose() {
    if (!view) {
        return;
    }

    view.emit('discord:FadeToBlack');
    view.close(1200);

    alt.setTimeout(() => {
        native.doScreenFadeIn(2000);
    }, 1200);
}
