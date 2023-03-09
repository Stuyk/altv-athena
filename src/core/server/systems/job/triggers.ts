import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { JobAttachable } from '@AthenaShared/interfaces/iAttachable';
import { Objective } from '@AthenaShared/interfaces/job';

/**
 * Calls any events attached to the current job objective that is being finished.
 *
 * Try calling an event. This should almost never be invoked manually.
 *
 * @export
 * @param {alt.Player} player
 * @param {Objective} objective
 */
export function tryEventCall(player: alt.Player, objective: Objective) {
    if (!objective.eventCall) {
        return;
    }

    if (objective.eventCall.isServer) {
        alt.emit(objective.eventCall.eventName, player);
    } else {
        player.emit(objective.eventCall.eventName);
    }
}

/**
 * Try playing an animation from the objective.
 *
 * This should almost never be invoked manually.
 *
 * @export
 * @param {alt.Player} player
 * @param {Objective} objective
 * @return {*}
 */
export function tryAnimation(player: alt.Player, objective: Objective) {
    if (!objective.animation) {
        return;
    }

    let delay = 0;
    if (objective.animation.delay) {
        delay = objective.animation.delay;
    }

    setTimeout(() => {
        if (objective.animation.rotation) {
            player.rot = objective.animation.rotation as alt.Vector3;
        }

        alt.nextTick(() => {
            Athena.player.emit.animation(
                player,
                objective.animation.dict,
                objective.animation.name,
                objective.animation.flags,
                objective.animation.duration,
            );
        });
    }, delay);
}

/**
 * Try attaching an object to a player.
 *
 * This should almost never be invoked manually.
 *
 * @export
 * @param {alt.Player} player
 * @param {Objective} objective
 * @return {*}
 */
export function tryAttach(player: alt.Player, objective: Objective) {
    if (!objective.attachable) {
        return;
    }

    const objectToAttach: JobAttachable = {
        model: objective.attachable.model,
        pos: objective.attachable.pos,
        rot: objective.attachable.rot,
        bone: objective.attachable.bone,
        uid: objective.attachable.uid,
    };

    Athena.player.emit.objectAttach(player, objectToAttach, objective.attachable.duration);
}
