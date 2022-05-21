import * as native from 'natives';
import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vector3 } from '../../shared/interfaces/vector';
import { isAnyMenuOpen } from '../utility/menus';
import Raycast from '../utility/raycast';
import { Timer } from '../utility/timers';
import { drawText3D } from '../utility/text';

interface ClosestTarget {
    scriptID: number;
    pos: Vector3;
    type?: 'npc' | 'player' | 'object' | 'vehicle';
}

let displayLabel = '';
let temporaryLabel = null;
let isProcessing = false;
let closestTarget: ClosestTarget;

class InternalFunctions {
    static init() {
        Timer.createInterval(InternalFunctions.find, 500);
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

                if (temporaryLabel) {
                    drawText3D(temporaryLabel, pos, 0.75, new alt.RGBA(255, 255, 255, 255));
                    return;
                }

                drawText3D(displayLabel, pos, 0.75, new alt.RGBA(255, 255, 255, 255));
            }
        }, 0);
    }

    static find() {
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
        const raycastInfo = Raycast.simpleRaycast(16 | 8 | 4 | 2 | 1);
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

        closestTarget = {
            pos: raycastInfo.position,
            scriptID: raycastInfo.entityHit,
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
    }
}

export class CameraTarget {
    /**
     * Returns information about what or who the player is looking at with their camera.
     *
     * @static
     * @return {(ClosestTarget | null)}
     * @memberof CameraTarget
     */
    static get(): ClosestTarget | null {
        return closestTarget;
    }

    /**
     * Lets you override the display label for text.
     * Normally it's a '.' but you can set it to '' to hide it.
     *
     * @static
     * @param {string} label
     * @memberof CameraTarget
     */
    static setDisplayLabel(label: string) {
        displayLabel = label;
    }

    /**
     * Overrides the label temporarily and resets after the player looks off of the object, vehicle, etc.
     *
     * @static
     * @param {string} label
     * @memberof CameraTarget
     */
    static setTemporaryLabel(label: string) {
        temporaryLabel = label;
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, InternalFunctions.init);
