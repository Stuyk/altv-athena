import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';

let isLocalPlayer = false;
let scriptID: number;
let cameraControlsInterval: number;
let camera: number;
let zpos = 0;
let fov = 90;
let startPosition: alt.Vector3;
let startCamPosition: alt.Vector3;
let timeBetweenAnimChecks = Date.now() + 100;
let controlStatus = false;
let camUpdateQueue: Array<{ zpos: number; fov: number; easeTime: number }> = [];
let isQueueReady = false;

/**
 * Creates a Pedestrian Edit Camera
 * @static
 * @param {number} _scriptID
 * @param {alt.IVector3} [offset=null]
 * @return {Promise<void>}
 *
 */
export async function create(_scriptID: number, offset: alt.IVector3 = null, _isLocalPlayer = false): Promise<void> {
    if (Overrides.create) {
        return Overrides.create(_scriptID, offset, _isLocalPlayer);
    }

    scriptID = _scriptID;
    isLocalPlayer = _isLocalPlayer;
    startPosition = native.getEntityCoords(scriptID, false);

    if (offset) {
        startPosition = calculateCamOffset(offset) as alt.Vector3;
    }

    if (!camera) {
        const forwardVector: alt.Vector3 = native.getEntityForwardVector(
            isLocalPlayer ? alt.Player.local.scriptID : scriptID,
        ) as alt.Vector3;

        const forwardCameraPosition: alt.Vector3 = {
            x: startPosition.x + forwardVector.x * 1.2,
            y: startPosition.y + forwardVector.y * 1.2,
            z: startPosition.z + zpos,
        } as alt.Vector3;

        // Set Focus in the Area
        native.requestCollisionAtCoord(forwardCameraPosition.x, forwardCameraPosition.y, forwardCameraPosition.z);
        native.setFocusPosAndVel(forwardCameraPosition.x, forwardCameraPosition.y, forwardCameraPosition.z, 0, 0, 0);
        await AthenaClient.utility.scene.load(forwardCameraPosition);

        fov = 90;
        startCamPosition = forwardCameraPosition;

        camera = native.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            startCamPosition.x,
            startCamPosition.y,
            startCamPosition.z,
            0,
            0,
            0,
            fov,
            true,
            0,
        );

        native.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z);
        native.setCamActive(camera, true);
        native.renderScriptCams(true, false, 0, true, false, 0);
    }

    cameraControlsInterval = alt.setInterval(handleControls, 0);
}

/**
 * Calculates a camera offset.
 * @static
 * @param {Vector3} offset
 * @return {void}  {Vector3}
 *
 */
export function calculateCamOffset(offset: alt.IVector3): alt.IVector3 {
    if (Overrides.calculateCamOffset) {
        return Overrides.calculateCamOffset(offset);
    }

    return native.getOffsetFromEntityInWorldCoords(
        isLocalPlayer ? alt.Player.local.scriptID : scriptID,
        offset.x,
        offset.y,
        offset.z,
    );
}

/**
 * Sets up the camera with the original position and a new offset.
 * @static
 * @param {alt.IVector3} offset
 *
 */
export function setCameraOffset(offset: alt.IVector3) {
    if (Overrides.setCameraOffset) {
        return Overrides.setCameraOffset(offset);
    }

    startPosition = calculateCamOffset(offset) as alt.Vector3;
    native.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z);
    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 0, true, false, 0);
}

/**
 * Check if a PedEditCamera exists.
 * @static
 * @return {void}
 *
 */
export function exists() {
    if (Overrides.exists) {
        return Overrides.exists();
    }

    return camera !== null;
}

/**
 * Destroy the Ped Edit Camera
 * @static
 *
 */
export async function destroy() {
    if (Overrides.destroy) {
        return Overrides.destroy();
    }

    if (cameraControlsInterval !== undefined && cameraControlsInterval !== null) {
        alt.clearInterval(cameraControlsInterval);
        cameraControlsInterval = null;
    }

    if (camera) {
        native.destroyCam(camera, true);
        camera = null;
    }

    native.clearFocus();
    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, 0);

    zpos = 0;
    fov = 90;
    startPosition = null;
    startCamPosition = null;
    isLocalPlayer = false;
    camUpdateQueue = [];
    isQueueReady = true;
    scriptID = null;
    controlStatus = false;
}

/**
 * Disable All Controls?
 * @static
 * @param {boolean} status
 *
 */
export function disableControls(status: boolean): void {
    if (Overrides.disableControls) {
        return Overrides.disableControls(status);
    }

    controlStatus = status;
}

/**
 * Set the Camera Field of View
 * @static
 * @param {*} value
 *
 */
export function setCamParams(_zpos: number = null, _fov: number = null, _easeTime: number = 500) {
    if (Overrides.setCamParams) {
        return Overrides.setCamParams(_zpos, _fov, _easeTime);
    }

    if (_zpos === null) {
        _zpos = zpos;
    }

    if (_fov === null) {
        _fov = fov;
    }

    camUpdateQueue.push({ zpos: _zpos, fov: _fov, easeTime: _easeTime });
}

export async function runQueue() {
    if (Overrides.runQueue) {
        return Overrides.runQueue();
    }

    if (camUpdateQueue.length <= 0) {
        return;
    }

    isQueueReady = false;

    const queueRef = camUpdateQueue.shift();
    if (!queueRef) {
        isQueueReady = true;
        return;
    }

    zpos = queueRef.zpos;
    fov = queueRef.fov;

    const camera2 = native.createCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        startCamPosition.x,
        startCamPosition.y,
        startCamPosition.z + zpos,
        0,
        0,
        0,
        fov,
        true,
        0,
    );

    native.setCamFov(camera2, fov);
    native.pointCamAtCoord(camera2, startPosition.x, startPosition.y, startPosition.z + zpos);
    native.setCamActiveWithInterp(camera2, camera, queueRef.easeTime, 1, 1);
    native.renderScriptCams(true, true, queueRef.easeTime, true, false, 0);

    await new Promise((resolve: Function) => {
        alt.setTimeout(() => {
            resolve();
        }, queueRef.easeTime);
    });

    native.destroyCam(camera, true);
    camera = camera2;
    isQueueReady = true;
}

/**
 * Update the ScriptID for who we should use to rotate.
 * @static
 * @param {number} id
 *
 */
export function update(id: number) {
    if (Overrides.update) {
        return Overrides.update(id);
    }

    scriptID = id;
}

export function handleControls() {
    if (Overrides.handleControls) {
        return Overrides.handleControls();
    }

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

    if (camera === null || camera === undefined) {
        return;
    }

    if (camUpdateQueue.length >= 1 && isQueueReady) {
        runQueue();
    }

    if (controlStatus) {
        return;
    }

    if (!native.doesEntityExist(isLocalPlayer ? alt.Player.local.scriptID : scriptID)) {
        return;
    }

    const [_, width] = native.getActualScreenResolution(0, 0);
    const cursor = alt.getCursorPos();
    const _x = cursor.x;
    let oldHeading = native.getEntityHeading(isLocalPlayer ? alt.Player.local.scriptID : scriptID);

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
            native.setEntityHeading(isLocalPlayer ? alt.Player.local.scriptID : scriptID, newHeading);
        }

        // Rotate Positive
        if (_x > width / 2) {
            const newHeading = (oldHeading += 2);
            native.setEntityHeading(isLocalPlayer ? alt.Player.local.scriptID : scriptID, newHeading);
        }
    }

    // d
    if (native.isDisabledControlPressed(0, 35)) {
        const newHeading = (oldHeading += 2);
        native.setEntityHeading(isLocalPlayer ? alt.Player.local.scriptID : scriptID, newHeading);
    }

    // a
    if (native.isDisabledControlPressed(0, 34)) {
        const newHeading = (oldHeading -= 2);
        native.setEntityHeading(isLocalPlayer ? alt.Player.local.scriptID : scriptID, newHeading);
    }

    if (Date.now() > timeBetweenAnimChecks) {
        timeBetweenAnimChecks = Date.now() + 1500;
        if (
            !native.isEntityPlayingAnim(isLocalPlayer ? alt.Player.local.scriptID : scriptID, 'nm@hands', 'hands_up', 3)
        ) {
            alt.emit('animation:Play', {
                dict: 'nm@hands',
                name: 'hands_up',
                duration: -1,
                flag: 2,
            });
        }
    }
}

alt.on('connectionComplete', () => {
    destroy();
});

alt.on('disconnect', () => {
    destroy();
});

interface PedEditCamFuncs {
    calculateCamOffset: typeof calculateCamOffset;
    create: typeof create;
    destroy: typeof destroy;
    disableControls: typeof disableControls;
    update: typeof update;
    handleControls: typeof handleControls;
    exists: typeof exists;
    runQueue: typeof runQueue;
    setCameraOffset: typeof setCameraOffset;
    setCamParams: typeof setCamParams;
}

const Overrides: Partial<PedEditCamFuncs> = {};

export function override(functionName: 'create', callback: typeof create);
export function override(functionName: 'destroy', callback: typeof destroy);
export function override(functionName: 'disableControls', callback: typeof disableControls);
export function override(functionName: 'update', callback: typeof update);
export function override(functionName: 'handleControls', callback: typeof handleControls);
export function override(functionName: 'exists', callback: typeof exists);
export function override(functionName: 'runQueue', callback: typeof runQueue);
export function override(functionName: 'setCameraOffset', callback: typeof setCameraOffset);
export function override(functionName: 'setCamParams', callback: typeof setCamParams);
export function override(functionName: keyof PedEditCamFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
