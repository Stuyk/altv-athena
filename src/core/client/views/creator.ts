import * as alt from 'alt-client';
import * as native from 'natives';
import { View } from '../extensions/view';
import {
    createPedEditCamera,
    destroyPedEditCamera,
    setShouldDisableControls,
    setFov,
    setZPos
} from '../utility/camera';
import { Appearance } from '../../shared/interfaces/Appearance';
import { View_Events_Creator } from '../../shared/enums/views';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

const url = `http://assets/webview/client/creator/index.html`;
const fModel = alt.hash('mp_f_freemode_01');
const mModel = alt.hash(`mp_m_freemode_01`);
let view: View;
let oldCharacterData: Partial<Appearance> | null = {};
let prevData: Partial<Appearance> | null = {};
let tempData: Partial<Appearance> | null = {};
let readyInterval: number;
let noDiscard = true;
let noName = true;
let totalCharacters = 0;

native.requestModel(fModel);
native.requestModel(mModel);

alt.onServer(View_Events_Creator.Sync, handleSync);
alt.onServer(View_Events_Creator.Show, handleView);
alt.onServer(View_Events_Creator.AwaitModel, handleFinishSync);
alt.onServer(View_Events_Creator.AwaitName, handleNameFinish);

async function handleView(_oldCharacterData = null, _noDiscard = true, _noName = true, _totalCharacters = 0) {
    oldCharacterData = _oldCharacterData;
    noDiscard = _noDiscard;
    noName = _noName;
    totalCharacters = _totalCharacters;

    view = await View.getInstance(url, true);
    view.on('creator:ReadyDone', handleReadyDone);
    view.on('creator:Done', handleDone);
    view.on('creator:Cancel', handleCancel);
    view.on('creator:Sync', handleSync);
    view.on('creator:CheckName', handleCheckName);
    view.on('creator:DisableControls', handleDisableControls);

    createPedEditCamera({ x: 0.18, y: -0.5, z: 0 });
    setFov(50);
    setZPos(0.6);
    readyInterval = alt.setInterval(waitForReady, 100);
}

function handleClose() {
    if (!view) {
        return;
    }

    native.doScreenFadeOut(100);
    oldCharacterData = null;
    destroyPedEditCamera();
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
    setShouldDisableControls(shouldDisableControls);
}

/**
 * Begins the character synchronization process.
 * @export
 * @param {Partial<Appearance>} data
 * @param {boolean} [shouldTPose=false]
 * @return {*}  {Promise<void>}
 */
export async function handleSync(data: Partial<Appearance>): Promise<void> {
    tempData = data;
    alt.Player.local.meta.appearance = data as Appearance;

    native.clearPedBloodDamage(alt.Player.local.scriptID);
    native.clearPedDecorations(alt.Player.local.scriptID);
    native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    const modelNeeded = data.sex === 0 ? fModel : mModel;
    if (modelNeeded !== native.getEntityModel(alt.Player.local.scriptID)) {
        // native.getEntityModel can be replaced with alt.Player.local.model in later updates.
        alt.emitServer(View_Events_Creator.AwaitModel, data.sex);
    } else {
        handleFinishSync();
    }
}

async function handleFinishSync() {
    native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
    native.setPedHeadBlendData(
        alt.Player.local.scriptID,
        tempData.faceMother,
        tempData.faceFather,
        0,
        tempData.skinMother,
        tempData.skinFather,
        0,
        parseFloat(tempData.faceMix.toString()),
        parseFloat(tempData.skinMix.toString()),
        0,
        false
    );

    // Facial Features
    for (let i = 0; i < tempData.structure.length; i++) {
        const value = tempData.structure[i];
        native.setPedFaceFeature(alt.Player.local.scriptID, i, value);
    }

    // Overlay Features - NO COLORS
    for (let i = 0; i < tempData.opacityOverlays.length; i++) {
        const overlay = tempData.opacityOverlays[i];
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            overlay.id,
            overlay.value,
            parseFloat(overlay.opacity.toString())
        );
    }

    // Hair
    const collection = native.getHashKey(tempData.hairOverlay.collection);
    const overlay = native.getHashKey(tempData.hairOverlay.overlay);
    native.addPedDecorationFromHashes(alt.Player.local.scriptID, collection, overlay);
    native.setPedComponentVariation(alt.Player.local.scriptID, 2, tempData.hair, 0, 0);
    native.setPedHairColor(alt.Player.local.scriptID, tempData.hairColor1, tempData.hairColor2);

    // Facial Hair
    native.setPedHeadOverlay(alt.Player.local.scriptID, 1, tempData.facialHair, tempData.facialHairOpacity);
    native.setPedHeadOverlayColor(
        alt.Player.local.scriptID,
        1,
        1,
        tempData.facialHairColor1,
        tempData.facialHairColor1
    );

    // Eyebrows
    native.setPedHeadOverlay(alt.Player.local.scriptID, 2, tempData.eyebrows, 1);
    native.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, tempData.eyebrowsColor1, tempData.eyebrowsColor1);

    // Decor
    for (let i = 0; i < tempData.colorOverlays.length; i++) {
        const overlay = tempData.colorOverlays[i];
        const color2 = overlay.color2 ? overlay.color2 : overlay.color1;
        native.setPedHeadOverlay(
            alt.Player.local.scriptID,
            overlay.id,
            overlay.value,
            parseFloat(overlay.opacity.toString())
        );
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, overlay.id, 1, overlay.color1, color2);
    }

    // Eyes
    native.setPedEyeColor(alt.Player.local.scriptID, tempData.eyes);

    native.clearAllPedProps(alt.Player.local.scriptID);

    if (tempData.sex === 0) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, 0, 0, 0); // mask
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, 0, 0, 0); // bag
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 35, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 0, 0, 0); // accessories
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // undershirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, 0, 0, 0); // body armour
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 15, 0, 0); // torso
    } else {
        native.setPedComponentVariation(alt.Player.local.scriptID, 1, 0, 0, 0); // mask
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 5, 0, 0, 0); // bag
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 34, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 7, 0, 0, 0); // accessories
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // undershirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 9, 0, 0, 0); // body armour
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 91, 0, 0); // torso
    }

    if (native.isScreenFadedOut()) {
        native.doScreenFadeIn(500);
    }

    native.setEntityCoordsNoOffset(
        alt.Player.local.scriptID,
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z,
        false,
        false,
        false
    );

    prevData = tempData;
}
