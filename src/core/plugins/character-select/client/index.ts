import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';
import { Character } from '@AthenaShared/interfaces/character';
import { getPage, open } from './page';

const CAM_POS = { x: -1355.8013916015625, y: -1182.136962890625, z: 4.85 };

let currentCharacter: Character;
let characterCount: number;
let newCam;
let everyTick;

function tick() {
    native.setUseHiDof();
}

function onClose() {
    //
}

function updateName() {
    AthenaClient.webview.emit('charSelectCharacterName', currentCharacter.name.replace(/\_/gm, ' '));
}

async function updatePreview(character: Character, count: number) {
    characterCount = count;
    currentCharacter = character;

    if (typeof newCam === 'undefined') {
        alt.setWatermarkPosition(0);
        alt.toggleGameControls(false);
        native.displayRadar(false);
        newCam = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            CAM_POS.x,
            CAM_POS.y,
            CAM_POS.z,
            0,
            0,
            0,
            55,
            false,
            1,
        );

        native.setCamUseShallowDofMode(newCam, true);
        native.setCamNearDof(newCam, 0.2);
        native.setCamFarDof(newCam, 3.5);
        native.setCamDofStrength(newCam, 1);
        native.setCamActive(newCam, true);
        native.pointCamAtEntity(newCam, alt.Player.local.scriptID, -0.5, 0, 0, false);
        native.renderScriptCams(true, true, 1000, false, false, 0);

        if (typeof everyTick === 'undefined') {
            everyTick = alt.everyTick(tick);
        }

        await alt.Utils.wait(1000);
        open(updateName, onClose);
    }

    updateName();
    native.taskLookAtCoord(alt.Player.local.scriptID, CAM_POS.x, CAM_POS.y, CAM_POS.z + 1, -1, 32, 99);
}

alt.onServer('updateCharacterSelectPedPreview', updatePreview);
alt.on('disconnect', () => {
    native.destroyAllCams(true);
});
