import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';

let isUpdating = false;
let nodes: Array<iCameraNode> = [];
let currentCamIndex = -1;
let cam1;
let cam2;

export interface iCameraNode {
    /**
     * Position for where to create this camera.
     *
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * Rotation of the camera, if applicable.
     * Also applies as rotation for entity attachment if applicable.
     *
     * @type {alt.IVector3}
     *
     */
    rot?: alt.IVector3;

    /**
     * Applies to entity attachment, and the offset from said entity.
     *
     * @type {alt.IVector3}
     *
     */
    offset?: alt.IVector3;

    /**
     * The FOV for the camera. Default is set to 90.
     *
     * @type {number}
     *
     */
    fov: number;

    /**
     * Time to ease between camera nodes. If only one camera node is present it does not apply.
     *
     * @type {number}
     *
     */
    easeTime?: number;

    /**
     * The entity `scriptID` to follow with the camera.
     *
     * @type {number}
     *
     */
    entityToTrack?: number;

    /**
     * A position to point that camera towards if applicable.
     *
     * @type {alt.IVector3}
     *
     */
    positionToTrack?: alt.IVector3;

    /**
     * The entity to attach this camera to, can be a vehicle, ped, etc.
     * Use `scriptID` for this.
     *
     * @type {number}
     *
     */
    entityToAttachTo?: number;

    /**
     * A vehicle bone index to attach to if `entityToAttachTo` is specified
     *
     * @type {number}
     *
     */
    vehicleBone?: number;

    /**
     * A pedestrian bone index to attach to if `entityToAttachTo` is specified
     *
     * @type {number}
     *
     */
    pedBone?: number;

    /**
     * If this is the last camera node, should we destroy the camera after easeTime?
     *
     * @type {boolean}
     *
     */
    isLastNode?: boolean;
}

const InternalFunctions = {
    /**
     * Check if the camera is currently moving between nodes.
     *
     * @return {void}
     *
     */
    async isCameraUpdating() {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (isUpdating) {
                    return;
                }

                alt.clearInterval(interval);
                resolve();
                return;
            }, 25);
        });
    },

    /**
     * Create a camera at the given position
     * @param {iCameraNode} node
     */
    async next(node: iCameraNode): Promise<void> {
        if (!node) {
            return;
        }

        if (isUpdating) {
            return;
        }

        isUpdating = true;

        native.requestCollisionAtCoord(node.pos.x, node.pos.y, node.pos.z);
        native.setFocusPosAndVel(node.pos.x, node.pos.y, node.pos.z, 0, 0, 0);
        await AthenaClient.utility.scene.load(node.pos);
        let assignCam2to1 = false;
        let camNumber: number;

        if (cam1) {
            cam2 = native.createCamWithParams(
                'DEFAULT_SCRIPTED_CAMERA',
                node.pos.x,
                node.pos.y,
                node.pos.z,
                0,
                0,
                0,
                90,
                true,
                0,
            );

            camNumber = cam2;
            assignCam2to1 = true;
        } else {
            cam1 = native.createCamWithParams(
                'DEFAULT_SCRIPTED_CAMERA',
                node.pos.x,
                node.pos.y,
                node.pos.z,
                0,
                0,
                0,
                90,
                true,
                0,
            );

            native.setCamActive(cam1, true);
            camNumber = cam1;
            assignCam2to1 = false;
            cam2 = null;
        }

        if (node.rot) {
            native.setCamRot(camNumber, node.rot.x, node.rot.y, node.rot.z, 2);
        }

        if (node.fov) {
            native.setCamFov(camNumber, node.fov);
        }

        if (node.positionToTrack) {
            native.pointCamAtCoord(camNumber, node.positionToTrack.x, node.positionToTrack.y, node.positionToTrack.z);
        }

        if (node.entityToTrack) {
            const offset = node.offset ? node.offset : { x: 0, y: 0, z: 0 };
            native.pointCamAtEntity(camNumber, node.entityToTrack, offset.x, offset.y, offset.z, true);
        }

        if (node.vehicleBone && node.entityToAttachTo) {
            const offset = node.offset ? node.offset : { x: 0, y: 0, z: 0 };
            const rot = node.rot ? node.rot : { x: 0, y: 0, z: 0 };
            native.attachCamToVehicleBone(
                camNumber,
                node.entityToAttachTo,
                node.vehicleBone,
                true,
                rot.x,
                rot.y,
                rot.z,
                offset.x,
                offset.y,
                offset.z,
                false,
            );
        }

        if (node.pedBone && node.entityToAttachTo) {
            const offset = node.offset ? node.offset : { x: 0, y: 0, z: 0 };
            native.attachCamToPedBone(
                camNumber,
                node.entityToAttachTo,
                node.vehicleBone,
                offset.x,
                offset.y,
                offset.z,
                true,
            );
        }

        if (node.entityToAttachTo && !node.pedBone && !node.vehicleBone) {
            const offset = node.offset ? node.offset : { x: 0, y: 0, z: 0 };
            native.attachCamToEntity(camNumber, node.entityToAttachTo, offset.x, offset.y, offset.z, true);
        }

        native.renderScriptCams(true, true, node.easeTime ? node.easeTime : 0, true, false, 0);

        if (cam1 && cam2) {
            native.setCamActiveWithInterp(cam2, cam1, node.easeTime ? node.easeTime : 0, 1, 1);
        }

        await new Promise((resolve: Function) => {
            alt.setTimeout(
                () => {
                    resolve();

                    if (node.isLastNode) {
                        InternalFunctions.destroy();
                    }

                    if (assignCam2to1) {
                        if (cam1 !== null && cam1 !== undefined) {
                            native.destroyCam(cam1, true);
                        }

                        cam1 = cam2;
                        cam2 = null;
                    }

                    isUpdating = false;
                },
                node.easeTime ? node.easeTime * 2 : 0,
            );
        });
    },

    /**
     * Clears current camera but does not clear nodes.
     *
     *
     */
    async clear() {
        if (cam1) {
            native.destroyCam(cam1, true);
            cam1 = null;
        }

        if (cam2) {
            native.destroyCam(cam2, true);
            cam2 = null;
        }

        native.clearFocus();
        native.destroyAllCams(true);
        native.renderScriptCams(false, false, 0, false, false, 0);

        currentCamIndex = -1;
    },

    /**
     * Destroy all cameras and clear the focus
     */
    async destroy() {
        isUpdating = false;
        InternalFunctions.clear();
        while (nodes.length >= 1) {
            nodes.pop();
        }
    },
};

/**
 * This function will destroy all camera instances
 *
 *
 */
export async function destroy(): Promise<void> {
    if (Overrides.destroy) {
        return Overrides.destroy();
    }

    return await InternalFunctions.destroy();
}

export async function overrideNodes(_nodes: Array<iCameraNode>) {
    if (Overrides.overrideNodes) {
        return Overrides.overrideNodes(_nodes);
    }

    nodes = _nodes;
}

/**
 * Add a camera node to the camera set.
 *
 * @param {iCameraNode} node
 *
 */
export async function addNode(node: iCameraNode) {
    if (Overrides.addNode) {
        return Overrides.addNode(node);
    }

    if (!node.pos) {
        throw new Error(`Camera Node -> Error: Position was not set for camera node.`);
    }

    if (!node.fov) {
        node.fov = 90;
    }

    if (node.entityToTrack && !native.doesEntityExist(node.entityToTrack)) {
        throw new Error(`Camera Node -> Error: Entity set to tracked does not exist.`);
    }

    nodes.push(node);
}

/**
 * Goes to the next camera.
 *
 * If `false` is passed in the function it will not remove a camera
 * from the camera array. Allows for repeating camera movement over and over.
 *
 * @param {boolean} [removeFromArray=true]
 * @return {Promise<boolean>}
 *
 */
export async function next(removeFromArray = true): Promise<boolean> {
    if (Overrides.next) {
        return Overrides.next(removeFromArray);
    }

    if (nodes.length <= 0) {
        return false;
    }

    await InternalFunctions.isCameraUpdating();

    if (removeFromArray) {
        const nextCam = nodes.shift();
        await InternalFunctions.next(nextCam);
    } else {
        currentCamIndex += 1;

        if (currentCamIndex >= nodes.length) {
            currentCamIndex = 0;
        }

        const nextCam = nodes[currentCamIndex];
        await InternalFunctions.next(nextCam);
    }

    return true;
}

/**
 * Goes to the index specified camera.
 *
 * If `false` is passed in the function it will not remove a camera
 * from the camera array. Allows for repeating camera movement over and over.
 *
 * @param {boolean} [removeFromArray=true]
 * @return {Promise<boolean>}
 *
 */
export async function switchNode(index: number, removeFromArray = true) {
    if (Overrides.switchNode) {
        return Overrides.switchNode;
    }

    if (nodes.length <= 0) {
        return false;
    }

    await InternalFunctions.isCameraUpdating();

    if (removeFromArray) {
        const prevCam = nodes.pop();
        await InternalFunctions.next(prevCam);
    } else {
        currentCamIndex -= 1;

        if (currentCamIndex < 0) {
            currentCamIndex = nodes.length - 1;
        }

        const prevCam = nodes[index];
        await InternalFunctions.next(prevCam);
    }

    return true;
}

/**
 * Goes to the previous camera.
 *
 * If `false` is passed in the function it will not remove a camera
 * from the camera array. Allows for repeating camera movement over and over.
 *
 * @param {boolean} [removeFromArray=true]
 * @return {Promise<boolean>}
 *
 */
export async function previous(removeFromArray = true): Promise<boolean> {
    if (Overrides.previous) {
        return Overrides.previous(removeFromArray);
    }

    if (nodes.length <= 0) {
        return false;
    }

    await InternalFunctions.isCameraUpdating();

    if (removeFromArray) {
        const prevCam = nodes.pop();
        await InternalFunctions.next(prevCam);
    } else {
        currentCamIndex -= 1;

        if (currentCamIndex < 0) {
            currentCamIndex = nodes.length - 1;
        }

        const prevCam = nodes[currentCamIndex];
        await InternalFunctions.next(prevCam);
    }

    return true;
}

/**
 * Play all camera nodes, but do not clear the camera nodes array.
 *
 *
 */
export async function play() {
    if (Overrides.play) {
        return Overrides.play();
    }

    const cameraNodes = [...nodes];
    for (let i = 0; i < cameraNodes.length; i++) {
        await InternalFunctions.isCameraUpdating();
        await InternalFunctions.next(cameraNodes[i]);
    }
}

interface CinematicCamFuncs {
    addNode: typeof addNode;
    destroy: typeof destroy;
    overrideNodes: typeof overrideNodes;
    next: typeof next;
    previous: typeof previous;
    switchNode: typeof switchNode;
    play: typeof play;
}

const Overrides: Partial<CinematicCamFuncs> = {};

export function override(functionName: 'addNode', callback: typeof addNode);
export function override(functionName: 'destroy', callback: typeof destroy);
export function override(functionName: 'overrideNodes', callback: typeof overrideNodes);
export function override(functionName: 'next', callback: typeof next);
export function override(functionName: 'switchNode', callback: typeof switchNode);
export function override(functionName: 'previous', callback: typeof previous);
export function override(functionName: 'play', callback: typeof play);
export function override(functionName: keyof CinematicCamFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
