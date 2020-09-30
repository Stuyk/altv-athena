import * as alt from 'alt-client';
import * as native from 'natives';
import { Character } from '../../../shared/interfaces/Character';
import { View } from '../../extensions/view';
import { createPedEditCamera, destroyPedEditCamera, setFov, setZPos } from '../../utility/camera';
import { handleSync } from '../creator/creator';

const url = `http://resource/client/views/characters/html/index.html`;
let view: View;
let characters: Partial<Character>[];

alt.onServer('characters:Show', handleView);
alt.onServer('characters:Done', handleClose);

async function handleView(_characters: Partial<Character>[]) {
    characters = _characters;

    if (!view) {
        view = await View.getInstance(url, true);
        view.on('load', handleLoad);
        view.on('characters:Select', handleSelect);
        view.on('characters:New', handleNew);
        view.on('characters:Update', handleSync); // Calls `creator.ts`
    }

    createPedEditCamera();
    setFov(50);
    setZPos(0.6);
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
}

function handleSelect(id) {
    alt.emitServer('characters:Select', id);
}

function handleNew() {
    alt.emitServer('characters:New');
}

function handleLoad() {
    if (!view) {
        return;
    }

    view.emit('characters:Set', characters);
}

function handleClose() {
    if (!view) {
        return;
    }

    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    destroyPedEditCamera();
    view.close();
}
