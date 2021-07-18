import * as alt from 'alt-client';
import * as native from 'natives';
import { View_Events_Characters } from '../../shared/enums/views';
import { Character } from '../../shared/interfaces/Character';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { View } from '../extensions/view';
import { createPedEditCamera, destroyPedEditCamera, setFov, setZPos } from '../utility/camera';
import { handleEquipment } from './clothing';
import { handleSync } from './creator';

const url = `http://assets/webview/client/characters/index.html`;
let view: View;
let characters: Partial<Character>[];
let open = false;

alt.onServer(View_Events_Characters.Show, handleView);
alt.onServer(View_Events_Characters.Done, handleDone);

async function handleView(_characters: Partial<Character>[]) {
    characters = _characters;

    view = await View.getInstance(url, true);
    view.on('load', handleLoad);
    view.on('characters:Select', handleSelect);
    view.on('characters:New', handleNew);
    view.on('characters:Update', handleSync); // Calls `creator.ts`
    view.on('characters:Equipment', handleEquipment);
    view.on('characters:Delete', handleDelete);
    view.on('characters:Ready', handleReady);

    // Handle Duplicate View Instance Creations
    if (open) {
        view.emit('characters:Set', characters);
        return;
    }

    open = true;
    createPedEditCamera();
    setFov(80);
    setZPos(0.2);
}

function handleReady() {
    view.emit('characters:SetLocale', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_CHARACTERS));
}

async function handleSelect(id) {
    native.doScreenFadeOut(100);
    alt.emitServer(View_Events_Characters.Select, id);
}

function handleNew() {
    alt.emitServer(View_Events_Characters.New);
}

function handleLoad() {
    if (!view) {
        return;
    }

    view.emit('characters:Set', characters);
}

function handleDelete(id) {
    alt.emitServer(View_Events_Characters.Delete, id);
}

function handleDone() {
    if (!view) {
        open = false;
        return;
    }

    destroyPedEditCamera();
    native.switchInPlayer(1500);
    view.close();
    open = false;
}
