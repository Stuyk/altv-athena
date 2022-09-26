import * as alt from 'alt-client';
import * as natives from 'natives';
import { KeyHeld } from '../../../client/events/keyHeld';
import { loadAnimation } from '../../../client/systems/animations';

let FINGERPOINT_B_KEY = 66

let active: boolean = false;
let interval: number = null;
let cleanStart: boolean = false;
let debounceTime: number = 150;
let lastBlockDate: number = null;
let localPlayer = alt.Player.local;

const Fingerpointing = {

    init() {
        KeyHeld.register(FINGERPOINT_B_KEY, Fingerpointing.start, Fingerpointing.stop);
    },

    async start() {
        if (active) return;
        active = true;
        try {

            await loadAnimation('anim@mp_point')

            natives.setPedCurrentWeaponVisible(
                localPlayer.scriptID,
                false,
                true,
                true,
                true
            );

            natives.setPedConfigFlag(localPlayer.scriptID, 36, true);
            natives.taskMoveNetworkByName(
                localPlayer.scriptID,
                'task_mp_pointing',
                0.5,
                false,
                'anim@mp_point',
                24
            );
            cleanStart = true;
            interval = alt.setInterval(Fingerpointing.process, 0);
        } catch (e) {
            alt.log(e);
        }
    },

    stop() {
        if (!active) return;
        if (interval) {
            alt.clearInterval(interval);
        }
        interval = null;

        active = false;

        if (!cleanStart) return;
        cleanStart = false;
        natives.requestTaskMoveNetworkStateTransition(
            localPlayer.scriptID,
            'Stop'
        );

        if (!natives.isPedInjured(localPlayer.scriptID)) {
            natives.clearPedSecondaryTask(localPlayer.scriptID);
        }
        if (!localPlayer.vehicle) {
            natives.setPedCurrentWeaponVisible(
                localPlayer.scriptID,
                true,
                true,
                true,
                true
            );
        }

        natives.setPedConfigFlag(localPlayer.scriptID, 36, false);
        natives.clearPedSecondaryTask(localPlayer.scriptID);
    },

    process() {
        if (!active) return;

        const camRot = natives.getGameplayCamRot(2);
        let camPitch = camRot.x - natives.getEntityPitch(localPlayer.scriptID);

        if (camPitch < -70.0) {
            camPitch = -70.0;
        } else if (camPitch > 42.0) {
            camPitch = 42.0;
        }

        camPitch = (camPitch + 70.0) / 112.0;

        let camHeading = natives.getGameplayCamRelativeHeading();
        let cosCamHeading = Math.cos(camHeading);
        let sinCamHeading = Math.sin(camHeading);

        if (camHeading < -180.0) {
            camHeading = -180.0;
        } else if (camHeading > 180.0) {
            camHeading = 180.0;
        }

        camHeading = (camHeading + 180.0) / 360.0;

        let coords = natives.getOffsetFromEntityInWorldCoords(
            localPlayer.scriptID,
            cosCamHeading * -0.2 - sinCamHeading * (0.4 * camHeading + 0.3),
            sinCamHeading * -0.2 + cosCamHeading * (0.4 * camHeading + 0.3),
            0.6
        );

        let ray = natives.startShapeTestCapsule(
            coords.x,
            coords.y,
            coords.z - 0.2,
            coords.x,
            coords.y,
            coords.z + 0.2,
            1.0,
            95,
            localPlayer.scriptID,
            7
        );

        let [_, blocked, coords1, coords2, entity] = natives.getShapeTestResult(
            ray,
            false,
            null,
            null,
            null
        );

        if (blocked && lastBlockDate === null) {
            lastBlockDate = Date.now();
        }

        natives.setTaskMoveNetworkSignalFloat(
            localPlayer.scriptID,
            'Pitch',
            camPitch
        );

        natives.setTaskMoveNetworkSignalFloat(
            localPlayer.scriptID,
            'Heading',
            camHeading * -1.0 + 1.0
        );

        //this is a debounce for isBlocked network signal to avoid flickering of the peds arm on fast raycast changes
        if (Fingerpointing.isBlockingAllowed()) {
            natives.setTaskMoveNetworkSignalBool(
                localPlayer.scriptID,
                'isBlocked',
                blocked
            );
        }

        natives.setTaskMoveNetworkSignalBool(
            localPlayer.scriptID,
            'isFirstPerson',
            natives.getCamViewModeForContext(natives.getCamActiveViewModeContext()) === 4
        );
    },

    isBlockingAllowed() {
        const isAllowed = Date.now() - lastBlockDate > debounceTime;
        if (isAllowed) {
            lastBlockDate = null;
        }
        return isAllowed;
    }
}

Fingerpointing.init();
