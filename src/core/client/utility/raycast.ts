import * as alt from 'alt-client';
import * as native from 'natives';
import { Vector3 } from '../../shared/interfaces/vector';
import { getDirectionFromRotation, rotationToDirection } from './math';

export default class Raycast {
    /**
     *
     * @static
     * @param {Vector3} start
     * @param {Vector3} end
     * @param {number} flags
     * @param {number} radius
     * @param {boolean} [useShapeTest=false]
     * @return {*}  {[number, boolean, Vector3, Vector3, number]}
     * @memberof Raycast
     */
    static performRaycast(
        start: Vector3,
        end: Vector3,
        flags: number,
        radius: number,
        useShapeTest = false,
    ): [number, boolean, Vector3, Vector3, number] {
        let raycast = null;

        // Ignore vehicle if in one.
        if (alt.Player.local.vehicle) {
            native.setEntityCollision(alt.Player.local.vehicle.scriptID, false, true);
        }

        if (!useShapeTest) {
            raycast = native.startExpensiveSynchronousShapeTestLosProbe(
                start.x,
                start.y,
                start.z,
                end.x,
                end.y,
                end.z,
                flags,
                alt.Player.local.scriptID,
                7,
            );
        } else {
            raycast = native.startShapeTestCapsule(
                start.x,
                start.y,
                start.z,
                end.x,
                end.y,
                end.z,
                radius,
                flags,
                alt.Player.local.scriptID,
                7,
            );
        }

        // Re-Toggle Vehicle
        if (alt.Player.local.vehicle) {
            native.setEntityCollision(alt.Player.local.vehicle.scriptID, true, true);
        }

        return native.getShapeTestResult(raycast);
    }

    /**
     * Raycast from the gameplay camera position.
     * Credit: Splak for gameplay camera snippet.
     * @static
     * @param {number} [flags=-1]
     * @param {boolean} [useShapeTest=false]
     * @param {number} [radius=5]
     * @return {(Vector3 | null)}
     * @memberof Raycast
     */
    static positionFromCamera(flags: number = -1, useShapeTest: boolean = false, radius: number = 5): Vector3 | null {
        const start = alt.getCamPos();
        const forwardVector = rotationToDirection(native.getFinalRenderedCamRot(2));
        const end = {
            x: start.x + forwardVector.x * 2000,
            y: start.y + forwardVector.y * 2000,
            z: start.z + forwardVector.z * 2000,
        };

        const [didComplete, didHit, position, surfaceNormal, entityHit] = Raycast.performRaycast(
            start,
            end,
            flags,
            radius,
            useShapeTest,
        );

        if (!didComplete || !didHit) {
            return null;
        }

        return position;
    }

    /**
     * A raycast that returns information about what and who may have been hit.
     * The raycast is performed from the camera rotation / position to a further end location.
     *
     * @static
     * @param {number} [flags=-1]
     * @param {boolean} [useShapeTest=false]
     * @param {number} [radius=5]
     * @return {*}  {{ didComplete: boolean; didHit?: boolean; position?: Vector3; entityHit?: number }}
     * @memberof Raycast
     */
    static simpleRaycast(
        flags: number = -1,
        maxDistance = 25,
        useShapeTest: boolean = true,
        radius: number = 2,
    ): { didComplete: boolean; didHit?: boolean; position?: Vector3; entityHit?: number } {
        const start = native.getFinalRenderedCamCoord();
        const forwardVector = getDirectionFromRotation(native.getFinalRenderedCamRot(2));
        const end = {
            x: start.x + forwardVector.x * maxDistance,
            y: start.y + forwardVector.y * maxDistance,
            z: start.z + forwardVector.z * maxDistance,
        };

        const [didComplete, didHit, position, surfaceNormal, entityHit] = Raycast.performRaycast(
            start,
            end,
            flags,
            radius,
            useShapeTest,
        );

        if (!didHit) {
            return { didComplete: false };
        }

        return { didComplete: true, didHit, position, entityHit };
    }

    /**
     * Raycast in the player's facing direction.
     * @static
     * @param {boolean} [useShapeTest=false]
     * @param {number} [radius=5]
     * @return {(Vector3 | null)}
     * @memberof Raycast
     */
    static positionFromPlayer(flags: number = -1, useShapeTest: boolean = false, radius: number = 5): Vector3 | null {
        const start = alt.Player.local.pos;
        const forwardVector = native.getEntityForwardVector(alt.Player.local.scriptID);
        const end = {
            x: start.x + forwardVector.x * 2000,
            y: start.y + forwardVector.y * 2000,
            z: start.z + forwardVector.z * 2000,
        };

        const [didComplete, didHit, position, surfaceNormal, entityHit] = Raycast.performRaycast(
            start,
            end,
            flags,
            radius,
            useShapeTest,
        );

        if (!didComplete || !didHit) {
            return null;
        }

        return position;
    }

    /**
     * Used to get if the player is currently facing water.
     * Credit: Alexa for quick snippet.
     * @static
     * @return {(null | Vector3)}
     * @memberof Raycast
     */
    static isFacingWater(): null | Vector3 {
        const headPosition = native.getPedBoneCoords(alt.Player.local.scriptID, 31086, 0, 0, 0);
        const offsetPosition = native.getOffsetFromEntityInWorldCoords(alt.Player.local.scriptID, 0, 50, -25);
        const [hit, position] = native.testProbeAgainstWater(
            headPosition.x,
            headPosition.y,
            headPosition.z,
            offsetPosition.x,
            offsetPosition.y,
            offsetPosition.z,
        );

        if (!hit) {
            return null;
        }

        return position;
    }
}
