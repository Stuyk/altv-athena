import * as alt from 'alt-client';
import { View } from '../../extensions/view';

const url = `http://resource/client/views/login/html/index.html`;
let view: View;
let discordURI: string;

alt.onServer('discord:Auth', handleView);
alt.onServer('discord:Close', handleClose);

function handleView(_discordURI) {
    discordURI = _discordURI;

    if (!view) {
        view = new View(url, true);
        view.extOn('discord:Loaded', handleLoad);
    }
}

function handleLoad() {
    if (!view) {
        return;
    }

    view.extEmit('discord:Ready', encodeURI(discordURI));
}

function handleClose() {
    if (!view) {
        return;
    }

    view.close();
}
