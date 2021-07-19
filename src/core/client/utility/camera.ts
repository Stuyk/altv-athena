import * as alt from 'alt-client';
import * as native from 'natives';
import { Timer } from './timers';

let cameraControlsInterval: number;
let camera: number;
let zpos = 0;
let fov = 90;
let startPosition: alt.Vector3;
let startCamPosition: alt.Vector3;
let timeBetweenAnimChecks = Date.now() + 100;
let controlStatus = false;

alt.on('connectionComplete', () => {
    destroyPedEditCamera();
});

alt.on('disconnect', () => {
    destroyPedEditCamera();
});

/**
 * Creates a pedestrian camera in front of the player.
 * Can be controlled with WASD and Mouse Controls.
 * @export
 */
export function createPedEditCamera(offset: alt.IVector3 = null): void {
    startPosition = { ...alt.Player.local.pos } as alt.Vector3;
    if (offset) {
        startPosition = native.getOffsetFromEntityInWorldCoords(
            alt.Player.local.scriptID,
            offset.x,
            offset.y,
            offset.z
        );
    }

    if (!camera) {
        const forwardVector: alt.Vector3 = native.getEntityForwardVector(alt.Player.local.scriptID) as alt.Vector3;
        const forwardCameraPosition: alt.Vector3 = {
            x: startPosition.x + forwardVector.x * 1.2,
            y: startPosition.y + forwardVector.y * 1.2,
            z: startPosition.z + zpos
        } as alt.Vector3;

        fov = 90;
        startCamPosition = forwardCameraPosition;

        camera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            forwardCameraPosition.x,
            forwardCameraPosition.y,
            forwardCameraPosition.z,
            0,
            0,
            0,
            fov,
            true,
            0
        );

        native.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z);
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false, 0);
    }

    cameraControlsInterval = Timer.createInterval(handleControls, 0, 'camera.ts');
}

/**
 * Destroys out current local pedestrian camera.
 * @export
 */
export function destroyPedEditCamera() {
    if (cameraControlsInterval !== undefined || cameraControlsInterval !== null) {
        Timer.clearInterval(cameraControlsInterval);
        cameraControlsInterval = null;
    }

    if (camera) {
        camera = null;
    }

    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, 0);

    zpos = 0;
    fov = 90;
    startPosition = null;
    startCamPosition = null;
}

/**
 * Temporarily disables camera controls.
 * @export
 * @param {boolean} status
 */
export function setShouldDisableControls(status: boolean): void {
    controlStatus = status;
}

function handleControls() {
    native.hideHudAndRadarThisFrame();
    native.disableAllControlActions(0);
    native.disableAllControlActions(1);
    native.disableControlAction(0, 0, true);
    native.disableControlAction(0, 1, true);
    native.disableControlAction(0, 2, true);
    native.disableControlAction(0, 24, true);
    native.disableControlAction(0, 25, true);
    native.disableControlAction(0, 32, true); // w
    native.disableControlAction(0, 33, true); // s
    native.disableControlAction(0, 34, true); // a
    native.disableControlAction(0, 35, true); // d

    if (controlStatus) {
        return;
    }

    const [_, width] = native.getActiveScreenResolution(0, 0);
    const cursor = alt.getCursorPos();
    const _x = cursor.x;
    let oldHeading = native.getEntityHeading(alt.Player.local.scriptID);

    // Scroll Up
    if (native.isDisabledControlPressed(0, 15)) {
        if (_x < width / 2 + 250 && _x > width / 2 - 250) {
            fov -= 2;

            if (fov < 10) {
                fov = 10;
            }

            native.setCamFov(camera, fov);
            native.setCamActive(camera, true);
            native.renderScriptCams(true, false, 0, true, false, 0);
        }
    }

    // SCroll Down
    if (native.isDisabledControlPressed(0, 16)) {
        if (_x < width / 2 + 250 && _x > width / 2 - 250) {
            fov += 2;

            if (fov > 130) {
                fov = 130;
            }

            native.setCamFov(camera, fov);
            native.setCamActive(camera, true);
            native.renderScriptCams(true, false, 0, true, false, 0);
        }
    }

    if (native.isDisabledControlPressed(0, 32)) {
        zpos += 0.01;

        if (zpos > 1.2) {
            zpos = 1.2;
        }

        native.setCamCoord(camera, startCamPosition.x, startCamPosition.y, startCamPosition.z + zpos);
        native.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z + zpos);
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false, 0);
    }

    if (native.isDisabledControlPressed(0, 33)) {
        zpos -= 0.01;

        if (zpos < -1.2) {
            zpos = -1.2;
        }

        native.setCamCoord(camera, startCamPosition.x, startCamPosition.y, startCamPosition.z + zpos);
        native.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z + zpos);
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false, 0);
    }

    // rmb
    if (native.isDisabledControlPressed(0, 25)) {
        // Rotate Negative
        if (_x < width / 2) {
            const newHeading = (oldHeading -= 2);
            native.setEntityHeading(alt.Player.local.scriptID, newHeading);
        }

        // Rotate Positive
        if (_x > width / 2) {
            const newHeading = (oldHeading += 2);
            native.setEntityHeading(alt.Player.local.scriptID, newHeading);
        }
    }

    // d
    if (native.isDisabledControlPressed(0, 35)) {
        const newHeading = (oldHeading += 2);
        native.setEntityHeading(alt.Player.local.scriptID, newHeading);
    }

    // a
    if (native.isDisabledControlPressed(0, 34)) {
        const newHeading = (oldHeading -= 2);
        native.setEntityHeading(alt.Player.local.scriptID, newHeading);
    }

    if (Date.now() > timeBetweenAnimChecks) {
        timeBetweenAnimChecks = Date.now() + 1500;
        if (!native.isEntityPlayingAnim(alt.Player.local.scriptID, 'nm@hands', 'hands_up', 3)) {
            alt.emit('animation:Play', {
                dict: 'nm@hands',
                name: 'hands_up',
                duration: -1,
                flag: 2
            });
        }
    }
}

/**
 * Set the camera field of view.
 * @export
 * @param {*} value
 */
export function setFov(value) {
    fov = value;

    native.setCamFov(camera, fov);
    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, true, false, 0);
}

/**
 * Set the camera position's z add-on value.
 * So it's camera.position.z + z
 * @export
 * @param {*} value
 */
export function setZPos(value) {
    zpos = value;

    native.setCamCoord(camera, startCamPosition.x, startCamPosition.y, startCamPosition.z + zpos);
    native.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z + zpos);
    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, true, false, 0);
}
