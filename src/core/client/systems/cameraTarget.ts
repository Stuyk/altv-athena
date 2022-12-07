import * as native from 'natives';
import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { isAnyMenuOpen } from '../utility/menus';
import Raycast from '../utility/raycast';
import { Timer } from '../utility/timers';
import { drawText3D } from '../utility/text';
import { KEY_BINDS } from '../../shared/enums/keyBinds';
import { ObjectWheelMenu } from '../menus/object';

interface ClosestTarget {
    scriptID: number;
    pos: alt.IVector3;
    normalizedZ?: number;
    type?: 'npc' | 'player' | 'object' | 'vehicle';
}

const ignoredEntities: Array<number> = [];
let displayLabel = `[~b~${String.fromCharCode(KEY_BINDS.INTERACT)}~w~]~n~.`;
let temporaryLabel = null;
let isProcessing = false;
let closestTarget: ClosestTarget;

const InternalFunctions = {
    init() {
        Timer.createInterval(InternalFunctions.find, 250, 'cameraTarget.ts');
        alt.setInterval(() => {
            if (isAnyMenuOpen(true)) {
                return;
            }

            if (alt.Player.local.vehicle) {
                return;
            }

            if (closestTarget && closestTarget.pos && closestTarget.scriptID !== 0) {
                const pos = native.getEntityCoords(closestTarget.scriptID, false);
                if (!pos) {
                    return;
                }

                if (closestTarget.type === 'object') {
                    const model = native.getEntityModel(closestTarget.scriptID);
                    if (!ObjectWheelMenu.isModelValidObject(model)) {
                        return;
                    }
                }

                if (temporaryLabel) {
                    drawText3D(
                        temporaryLabel,
                        new alt.Vector3(pos.x, pos.y, closestTarget.normalizedZ),
                        0.75,
                        new alt.RGBA(255, 255, 255, 255),
                    );
                    return;
                }

                drawText3D(
                    displayLabel,
                    new alt.Vector3(pos.x, pos.y, closestTarget.normalizedZ),
                    0.75,
                    new alt.RGBA(255, 255, 255, 255),
                );
            }
        }, 0);
    },
    find() {
        if (alt.Player.local.vehicle) {
            return;
        }

        if (isAnyMenuOpen(true)) {
            return;
        }

        if (isProcessing) {
            return;
        }

        isProcessing = true;

        // Do the processing for camera target
        const raycastInfo = Raycast.simpleRaycast(16 | 8 | 4 | 2 | 1, 15);
        if (!raycastInfo.didComplete || !raycastInfo.didHit) {
            closestTarget = null;
            temporaryLabel = null;
            isProcessing = false;
            return;
        }

        if (!raycastInfo.entityHit || !native.isEntityOnScreen(raycastInfo.entityHit)) {
            closestTarget = null;
            temporaryLabel = null;
            isProcessing = false;
            return;
        }

        const isIgnoredIndex = ignoredEntities.findIndex((x) => x === raycastInfo.entityHit);
        if (isIgnoredIndex >= 0) {
            closestTarget = null;
            temporaryLabel = null;
            isProcessing = false;
            return;
        }

        const coords = native.getEntityCoords(raycastInfo.entityHit, false);
        const model = native.getEntityModel(raycastInfo.entityHit);
        const [_, min, max] = native.getModelDimensions(model);
        const halfHeight = (Math.abs(min.z) + Math.abs(max.z)) / 2;

        closestTarget = {
            pos: raycastInfo.position,
            scriptID: raycastInfo.entityHit,
            normalizedZ: coords.z - Math.abs(min.z) + halfHeight,
        };

        if (alt.Player.all.find((p) => `${p.scriptID}` === `${raycastInfo.entityHit}`)) {
            closestTarget.type = 'player';
            isProcessing = false;
            return;
        }

        if (alt.Vehicle.all.find((v) => `${v.scriptID}` === `${raycastInfo.entityHit}`)) {
            closestTarget.type = 'vehicle';
            isProcessing = false;
            return;
        }

        if (native.isEntityAPed(raycastInfo.entityHit)) {
            closestTarget.type = 'npc';
            isProcessing = false;
            return;
        }

        if (native.isEntityAnObject(raycastInfo.entityHit)) {
            closestTarget.type = 'object';
            isProcessing = false;
            return;
        }

        temporaryLabel = null;
        closestTarget = null;
        isProcessing = false;
    },
};

export const CameraTarget = {
    /**
     * Returns information about what or who the player is looking at with their camera.
     *
     * @static
     * @return {(ClosestTarget | null)}
     */
    get(): ClosestTarget | null {
        return closestTarget;
    },
    /**
     * Lets you override the display label for text.
     * Normally it's a '.' but you can set it to '' to hide it.
     *
     * @static
     * @param {string} label
     * @memberof CameraTarget
     */
    setDisplayLabel(label: string) {
        displayLabel = label;
    },
    /**
     * Overrides the label temporarily and resets after the player looks off of the object, vehicle, etc.
     *
     * @static
     * @param {string} label
     * @memberof CameraTarget
     */
    setTemporaryLabel(label: string) {
        temporaryLabel = label;
    },
    /**
     * Adds an ignored entity; to prevent the CameraTarget from selecting it.
     * Can be a player, vehicle, etc.
     *
     * @param {number} handle
     */
    addIgnoredEntity(handle: number) {
        const index = ignoredEntities.findIndex((x) => x === handle);
        if (index === -1) {
            ignoredEntities.push(index);
        }
    },
    /**
     * Adds an ignored entity; to prevent the CameraTarget from selecting it.
     * Can be a player, vehicle, etc.
     *
     * @param {number} handle
     */
    removeIgnoredEntity(handle: number) {
        const index = ignoredEntities.findIndex((x) => x === handle);
        if (index === -1) {
            return;
        }

        ignoredEntities.splice(index, 1);
    },
};

alt.onceServer(SYSTEM_EVENTS.TICKS_START, InternalFunctions.init);
