import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { getPage, open } from './page.js';
import { MAIN_CHARACTER_CREATOR_EVENTS } from '../shared/events.js';

const CAM_POS = new alt.Vector3({ x: -1355.8013916015625, y: -1182.136962890625, z: 4.85 });

let newCam;
let everyTick;

function tick() {
    native.setUseHiDof();
    native.setPedCanHeadIk(alt.Player.local.scriptID, false);
    native.clearPedSecondaryTask(alt.Player.local.scriptID);
    native.setClockTime(8, 0, 0);
}

function onClose() {
    // Unused; just leave it here.
}

async function updatePreview() {
    native.setEntityRotation(alt.Player.local.scriptID, 0, 0, 125, 1, false);
    native.setPedDesiredHeading(alt.Player.local.scriptID, 125);

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
        native.setCamFov(newCam, 20);
        native.setCamNearDof(newCam, 0.2);
        native.setCamFarDof(newCam, 3.5);
        native.setCamDofStrength(newCam, 1);
        native.setCamActive(newCam, true);
        native.pointCamAtPedBone(newCam, alt.Player.local.scriptID, 0x322c, -0.1, 0, 0, false);
        native.renderScriptCams(true, false, 0, false, false, 0);
        native.taskLookAtCoord(alt.Player.local.scriptID, CAM_POS.x, CAM_POS.y, CAM_POS.z, -1, 1, 99);

        if (typeof everyTick === 'undefined') {
            everyTick = alt.everyTick(tick);
        }

        await alt.Utils.wait(1000);
        open(() => {}, onClose);
    } else {
        native.pointCamAtPedBone(newCam, alt.Player.local.scriptID, 0x322c, -0.1, 0, 0, false);
        native.taskLookAtCoord(alt.Player.local.scriptID, CAM_POS.x, CAM_POS.y, CAM_POS.z, -1, 1, 99);
    }
}

function done() {
    native.destroyAllCams(true);
    native.setCamActive(newCam, false);
    native.renderScriptCams(false, false, 0, false, false, 0);

    if (everyTick) {
        alt.clearEveryTick(everyTick);
        everyTick = undefined;
    }

    const page = getPage();
    page.close(true);
}

alt.onServer(MAIN_CHARACTER_CREATOR_EVENTS.SHOW, updatePreview);
alt.onServer(MAIN_CHARACTER_CREATOR_EVENTS.DONE, done);
alt.on('disconnect', () => {
    native.destroyAllCams(true);
});
