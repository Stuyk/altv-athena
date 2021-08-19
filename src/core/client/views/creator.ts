import * as alt from 'alt-client';
import * as native from 'natives';
import { View } from '../extensions/view';
import PedEditCamera from '../utility/camera';
import { Appearance } from '../../shared/interfaces/Appearance';
import { View_Events_Creator } from '../../shared/enums/views';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { PedCharacter } from '../utility/characterPed';
import { CharacterSystem } from '../systems/character';
import { Vector3 } from '../../shared/interfaces/Vector';
import { sleep } from '../utility/sleep';

const url = `http://assets/webview/client/creator/index.html`;
const fModel = alt.hash('mp_f_freemode_01');
const mModel = alt.hash(`mp_m_freemode_01`);
let view: View;
let oldCharacterData: Partial<Appearance> | null = {};
let readyInterval: number;
let noDiscard = true;
let noName = true;
let totalCharacters = 0;

native.requestModel(fModel);
native.requestModel(mModel);

alt.onServer(View_Events_Creator.Sync, handleSync);
alt.onServer(View_Events_Creator.Show, handleView);
alt.onServer(View_Events_Creator.AwaitName, handleNameFinish);

async function handleView(
    pos: Vector3,
    heading: number,
    _oldCharacterData = null,
    _noDiscard = true,
    _noName = true,
    _totalCharacters = 0
) {
    oldCharacterData = _oldCharacterData;
    noDiscard = _noDiscard;
    noName = _noName;
    totalCharacters = _totalCharacters;

    await PedCharacter.destroy();
    await sleep(100);

    view = await View.getInstance(url, true);
    view.on('creator:ReadyDone', handleReadyDone);
    view.on('creator:Done', handleDone);
    view.on('creator:Cancel', handleCancel);
    view.on('creator:Sync', handleSync);
    view.on('creator:CheckName', handleCheckName);
    view.on('creator:DisableControls', handleDisableControls);

    await PedCharacter.create(true, pos, heading);
    await sleep(100);
    await PedEditCamera.create(PedCharacter.get(), { x: 0.18, y: -0.5, z: 0 });

    PedEditCamera.setFov(50);
    PedEditCamera.setZPos(0.6);
    readyInterval = alt.setInterval(waitForReady, 100);
}

function handleClose() {
    if (!view) {
        return;
    }

    native.doScreenFadeOut(100);
    oldCharacterData = null;
    PedEditCamera.destroy();
    PedCharacter.destroy();
    view.close();
}

async function handleDone(newData, infoData, name: string) {
    await handleClose();
    alt.emitServer(View_Events_Creator.Done, newData, infoData, name);
}

async function handleCancel() {
    handleClose();
    alt.emitServer(View_Events_Creator.Done, oldCharacterData);
}

function waitForReady() {
    if (!view) {
        return;
    }

    view.emit('creator:Ready', noDiscard, noName);
}

function handleReadyDone() {
    if (readyInterval !== undefined || readyInterval !== null) {
        alt.clearInterval(readyInterval);
        readyInterval = null;
    }

    view.emit('creator:SetData', oldCharacterData, totalCharacters);
    view.emit('creator:SetLocales', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_CREATOR));
}

function handleCheckName(name: string): void {
    alt.emitServer(View_Events_Creator.AwaitName, name);
}

function handleNameFinish(result: boolean): void {
    view.emit('creator:IsNameAvailable', result);
}

function handleDisableControls(shouldDisableControls: boolean): void {
    PedEditCamera.disableControls(shouldDisableControls);
}

/**
 * Begins the character synchronization process.
 * @export
 * @param {Appearance} data
 * @param {boolean} [shouldTPose=false]
 * @return {Promise<void>}
 */
export async function handleSync(data: Appearance): Promise<void> {
    await PedCharacter.apply(data);
    PedEditCamera.update(PedCharacter.get());
}
