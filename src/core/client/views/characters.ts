import * as alt from 'alt-client';
import * as native from 'natives';
import { View_Events_Characters } from '../../shared/enums/views';
import { Character } from '../../shared/interfaces/Character';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { createPedEditCamera, destroyPedEditCamera, setFov, setZPos } from '../utility/camera';
import { handleEquipment } from './clothing';
import { handleSync } from './creator';
import { WebViewController } from '../extensions/view2';

let characters: Partial<Character>[];

alt.onServer(View_Events_Characters.Show, handleView);
alt.onServer(View_Events_Characters.Done, handleDone);

async function handleView(_characters: Partial<Character>[]) {
    characters = _characters;

    const view = await WebViewController.get();
    view.on('characters:Select', handleSelect);
    view.on('characters:New', handleNew);
    view.on('characters:Update', handleSync); // Calls `creator.ts`
    view.on('characters:Equipment', handleEquipment);
    view.on('characters:Delete', handleDelete);
    view.on('characters:Ready', handleReady);
    WebViewController.openPages(['CharacterSelect']);
    WebViewController.focus();
    WebViewController.showCursor(true);

    createPedEditCamera();
    setFov(75);
    setZPos(0.35);
}

async function handleReady() {
    const view = await WebViewController.get();

    alt.log('got ready event');
    view.emit('characters:SetLocale', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_CHARACTERS));
    view.emit('characters:Set', characters);
}

async function handleSelect(id) {
    native.doScreenFadeOut(100);
    alt.emitServer(View_Events_Characters.Select, id);
}

function handleNew() {
    alt.emitServer(View_Events_Characters.New);
}

function handleDelete(id) {
    alt.emitServer(View_Events_Characters.Delete, id);
}

function handleDone() {
    WebViewController.closePages(['CharacterSelect']);
    WebViewController.unfocus();
    WebViewController.showCursor(false);
    destroyPedEditCamera();
    native.switchInPlayer(1500);
}
