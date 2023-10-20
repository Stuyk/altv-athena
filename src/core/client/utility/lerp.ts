import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { distance, vectorLerp } from '@AthenaShared/utility/vector.js';

const LerpObject = {
    /**
     * Lerp an object with an ID from one point to another.
     *
     * @static
     * @param {number} id
     * @param {alt.IVector3} to
     * @param {number} [speed=0.1]
     * @return {void}
     *
     */
    async lerp(id: number, to: alt.IVector3, speed = 0.1) {
        let runTimer = 0;
        let dist = 0;
        native.freezeEntityPosition(id, true);

        return new Promise((resolve) => {
            const objectInterval = alt.setInterval(() => {
                const pos = native.getEntityCoords(id, false);
                dist = distance(pos, to);

                const objectSpeed = (1.0 / dist) * 0.01 * speed;
                runTimer = runTimer + objectSpeed;

                const posTick = vectorLerp(pos, to, runTimer, false);
                native.setEntityCoords(id, posTick.x, posTick.y, posTick.z, false, false, false, false);

                if (dist <= 0.05) {
                    alt.clearInterval(objectInterval);
                    resolve(true);
                }
            }, 1);
        });
    },

    /**
     * Create and move a temporary object.
     * @static
     * @param {string} model
     * @param {alt.IVector3} start
     * @param {alt.IVector3} end
     * @param {0.1} speed
     *
     */
    async tempLerp(model: string, start: alt.IVector3, end: alt.IVector3, speed: number = 0.1) {
        const hash = alt.hash(model);
        await AthenaClient.utility.model.load(hash);

        const object = native.createObjectNoOffset(hash, start.x, start.y, start.z, false, false, false);

        await alt.Utils.wait(50);

        native.freezeEntityPosition(object, true);
        native.setEntityNoCollisionEntity(object, alt.Player.local.scriptID, false);

        await LerpObject.lerp(object, end, speed);

        native.deleteObject(object);
    },
};

alt.onServer(SYSTEM_EVENTS.PLAYER_EMIT_TEMP_OBJECT_LERP, LerpObject.tempLerp);
