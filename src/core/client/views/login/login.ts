import * as alt from 'alt-client';
import { View } from '../../extensions/view';

const url = `http://resource/client/views/login/html/index.html`;
let view: View;
let discordURI: string;

alt.onServer('discord:Auth', handleView);

function handleView(_discordURI) {
    discordURI = _discordURI;

    if (!view) {
        view = new View(url, true);
        view.on('load', handleLoad);
    }
}

function handleLoad() {
    if (!view) {
        return;
    }

    view.emit('discord:Ready', discordURI);
}
