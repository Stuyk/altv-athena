import * as alt from 'alt-client';
import * as native from 'natives';
import { View } from '../../extensions/view';

const url = `http://resource/client/views/characters/html/index.html`;
let view: View;

alt.onServer('characters:Show', handleView);

async function handleView() {
    if (!view) {
        view = await View.getInstance(url, true);
    }
}

function handleClose() {
    if (!view) {
        return;
    }

    view.close();
}
