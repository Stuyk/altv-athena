import * as alt from 'alt-client';
import * as native from 'natives';
import { getPointsInCircle } from './math';
import { loadSceneAtCoords } from './scene';

let isUpdating = false;
let nodes: Array<iCameraNode> = [];
let currentCamIndex = -1;
let cam1;
let cam2;

interface iCameraNode {
    /**
     * Position for where to create this camera.
     *
     * @type {alt.IVector3}
     * @memberof iCameraNode
     */
    pos: alt.IVector3;

    /**
     * Rotation of the camera, if applicable.
     * Also applies as rotation for entity attachment if applicable.
     *
     * @type {alt.IVector3}
     * @memberof iCameraNode
     */
    rot?: alt.IVector3;

    /**
     * Applies to entity attachment, and the offset from said entity.
     *
     * @type {alt.IVector3}
     * @memberof iCameraNode
     */
    offset?: alt.IVector3;

    /**
     * The FOV for the camera. Default is set to 90.
     *
     * @type {number}
     * @memberof iCameraNode
     */
    fov: number;

    /**
     * Time to ease between camera nodes. If only one camera node is present it does not apply.
     *
     * @type {number}
     * @memberof iCameraNode
     */
    easeTime?: number;

    /**
     * The entity `scriptID` to follow with the camera.
     *
     * @type {number}
     * @memberof iCameraNode
     */
    entityToTrack?: number;

    /**
     * A position to point that camera towards if applicable.
     *
     * @type {alt.IVector3}
     * @memberof iCameraNode
     */
    positionToTrack?: alt.IVector3;

    /**
     * The entity to attach this camera to, can be a vehicle, ped, etc.
     * Use `scriptID` for this.
     *
     * @type {number}
     * @memberof iCameraNode
     */
    entityToAttachTo?: number;

    /**
     * A vehicle bone index to attach to if `entityToAttachTo` is specified
     *
     * @type {number}
     * @memberof iCameraNode
     */
    vehicleBone?: number;

    /**
     * A pedestrian bone index to attach to if `entityToAttachTo` is specified
     *
     * @type {number}
     * @memberof iCameraNode
     */
    pedBone?: number;

    /**
     * If this is the last camera node, should we destroy the camera after easeTime?
     *
     * @type {boolean}
     * @memberof iCameraNode
     */
    isLastNode?: boolean;
}

const InternalFunctions = {
    /**
     * Check if the camera is currently moving between nodes.
     *
     * @static
     * @return {*}
     * @memberof InternalFunctions
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
     * @param {alt.IVector3} pos - The position of the camera.
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
        await loadSceneAtCoords(node.pos);
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
     * @static
     * @memberof InternalFunctions
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

export const CinematicCam = {
    /**
     * This function will destroy all camera instances
     *
     * @static
     * @memberof CinematicCam
     */
    async destroy(): Promise<void> {
        return await InternalFunctions.destroy();
    },

    async overrideNodes(_nodes: Array<iCameraNode>) {
        nodes = _nodes;
    },

    /**
     * Add a camera node to the camera set.
     *
     * @static
     * @param {iCameraNode} node
     * @memberof CinematicCam
     */
    async addNode(node: iCameraNode) {
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
    },

    /**
     * Goes to the next camera.
     *
     * If `false` is passed in the function it will not remove a camera
     * from the camera array. Allows for repeating camera movement over and over.
     *
     * @static
     * @param {boolean} [removeFromArray=true]
     * @return {Promise<boolean>}
     * @memberof CinematicCam
     */
    async next(removeFromArray = true): Promise<boolean> {
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
    },

    /**
     * Play all camera nodes, but do not clear the camera nodes array.
     *
     * @static
     * @memberof CinematicCam
     */
    async play() {
        const cameraNodes = [...nodes];
        for (let i = 0; i < cameraNodes.length; i++) {
            await InternalFunctions.isCameraUpdating();
            await InternalFunctions.next(cameraNodes[i]);
        }
    },

    demo() {
        alt.setTimeout(() => {
            native.setEntityCoordsNoOffset(
                alt.Player.local.scriptID,
                -383.385375976562,
                -120.65264892578125,
                38.68716812133789,
                false,
                false,
                false,
            );

            const points = getPointsInCircle(8, 2, { x: -383.385375976562, y: -120.65264892578125 });
            for (let i = 0; i < points.length; i++) {
                CinematicCam.addNode({
                    pos: { x: points[i].x, y: points[i].y, z: alt.Player.local.pos.z },
                    fov: 90,
                    entityToTrack: alt.Player.local.scriptID,
                    easeTime: 1000,
                    isLastNode: i === points.length - 1 ? true : false,
                });
            }

            /* This is a function that will play all of the camera nodes in the array. */
            CinematicCam.play();
        }, 1500);
    },
};

// alt.onServer(SYSTEM_EVENTS.TICKS_START, CinematicCam.demo);
