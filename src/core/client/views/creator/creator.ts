import * as alt from 'alt-client';
import * as native from 'natives';
import { View } from '../../extensions/view';
import { createPedEditCamera, destroyPedEditCamera, setFov, setZPos } from '../../utility/camera';
import { Appearance } from '../../../shared/interfaces/Appearance';
import { View_Events_Creator } from '../../../shared/enums/views';

const url = `http://resource/client/views/creator/html/index.html`;
const fModel = alt.hash('mp_f_freemode_01');
const mModel = alt.hash(`mp_m_freemode_01`);
let view: View;
let oldCharacterData: Partial<Appearance> | null = {};
let prevData: Partial<Appearance> | null = {};
let readyInterval: number;
let noDiscard = true;
let noName = true;

native.requestModel(fModel);
native.requestModel(mModel);
alt.loadModel(fModel);
alt.loadModel(mModel);

alt.onServer(View_Events_Creator.Sync, handleSync);
alt.onServer(View_Events_Creator.Show, handleView);

async function handleView(_oldCharacterData = null, _noDiscard = true, _noName = true) {
    oldCharacterData = _oldCharacterData;
    noDiscard = _noDiscard;
    noName = _noName;

    if (!view) {
        view = await View.getInstance(url, true);
        view.on('creator:ReadyDone', handleReadyDone);
        view.on('creator:Done', handleDone);
        view.on('creator:Cancel', handleCancel);
        view.on('creator:Sync', handleSync);
    }

    createPedEditCamera();
    setFov(50);
    setZPos(0.6);
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    readyInterval = alt.setInterval(waitForReady, 100);
}

function handleClose() {
    if (!view) {
        return;
    }

    oldCharacterData = null;
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    destroyPedEditCamera();
    view.close();
}

function handleDone(newData) {
    alt.emitServer(View_Events_Creator.Done, newData);
    handleClose();
}

function handleCancel() {
    alt.emitServer(View_Events_Creator.Done, oldCharacterData);
    handleClose();
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

    view.emit('creator:SetData', oldCharacterData);
}

function doesModelMatch(model) {
    return new Promise((resolve: Function) => {
        let attempts = 0;
        let interval = alt.setInterval(() => {
            attempts++;

            if (attempts > 5000) {
                alt.clearInterval(interval);
                resolve();
                return;
            }

            const pModel = native.getEntityModel(alt.Player.local.scriptID);
            if (pModel !== model) {
                return;
            }

            resolve();
            alt.clearInterval(interval);
        }, 25);
    });
}

export async function handleSync(data) {
    native.clearPedBloodDamage(alt.Player.local.scriptID);
    native.clearPedDecorations(alt.Player.local.scriptID);
    native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);

    const hash = data.sex === 0 ? fModel : mModel;
    if (!prevData || prevData.sex !== data.sex) {
        native.setPlayerModel(alt.Player.local.scriptID, hash);
        await doesModelMatch(hash);
    }

    native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
    native.setPedHeadBlendData(
        alt.Player.local.scriptID,
        data.faceFather,
        data.faceMother,
        0,
        data.skinFather,
        data.skinMother,
        0,
        parseFloat(data.faceMix),
        parseFloat(data.skinMix),
        0,
        false
    );

    // Facial Features
    for (let i = 0; i < data.structure.length; i++) {
        const value = data.structure[i];
        native.setPedFaceFeature(alt.Player.local.scriptID, i, value);
    }

    // Overlay Features - NO COLORS
    for (let i = 0; i < data.opacityOverlays.length; i++) {
        const overlay = data.opacityOverlays[i];
        native.setPedHeadOverlay(alt.Player.local.scriptID, overlay.id, overlay.value, parseFloat(overlay.opacity));
    }

    // Hair
    const collection = native.getHashKey(data.hairOverlay.collection);
    const overlay = native.getHashKey(data.hairOverlay.overlay);
    native.addPedDecorationFromHashes(alt.Player.local.scriptID, collection, overlay);
    native.setPedComponentVariation(alt.Player.local.scriptID, 2, data.hair, 0, 0);
    native.setPedHairColor(alt.Player.local.scriptID, data.hairColor1, data.hairColor2);

    // Facial Hair
    native.setPedHeadOverlay(alt.Player.local.scriptID, 1, data.facialHair, data.facialHairOpacity);
    native.setPedHeadOverlayColor(alt.Player.local.scriptID, 1, 1, data.facialHairColor1, data.facialHairColor1);

    // Eyebrows
    native.setPedHeadOverlay(alt.Player.local.scriptID, 2, data.eyebrows, 1);
    native.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, data.eyebrowsColor1, data.eyebrowsColor1);

    // Decor
    for (let i = 0; i < data.colorOverlays.length; i++) {
        const overlay = data.colorOverlays[i];
        const color2 = overlay.color2 ? overlay.color2 : overlay.color1;
        native.setPedHeadOverlay(alt.Player.local.scriptID, overlay.id, overlay.value, parseFloat(overlay.opacity));
        native.setPedHeadOverlayColor(alt.Player.local.scriptID, overlay.id, 1, overlay.color1, color2);
    }

    // Eyes
    native.setPedEyeColor(alt.Player.local.scriptID, data.eyes);

    if (data.sex === 0) {
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 35, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // shirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 15, 0, 0); // torso
    } else {
        native.setPedComponentVariation(alt.Player.local.scriptID, 3, 15, 0, 0); // arms
        native.setPedComponentVariation(alt.Player.local.scriptID, 4, 14, 0, 0); // pants
        native.setPedComponentVariation(alt.Player.local.scriptID, 6, 34, 0, 0); // shoes
        native.setPedComponentVariation(alt.Player.local.scriptID, 8, 15, 0, 0); // shirt
        native.setPedComponentVariation(alt.Player.local.scriptID, 11, 91, 0, 0); // torso
    }

    prevData = data;
}
