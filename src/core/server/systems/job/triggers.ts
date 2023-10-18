import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { JobAttachable } from '@AthenaShared/interfaces/iAttachable.js';
import { Objective } from '@AthenaShared/interfaces/job.js';

/**
 * Calls any events attached to the current job objective that is being finished.
 *
 * Try calling an event. This should almost never be invoked manually.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Objective} objective
 */
export function tryEventCall(player: alt.Player, objective: Objective) {
    if (Overrides.tryEventCall) {
        return Overrides.tryEventCall(player, objective);
    }

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
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Objective} objective
 * @return {void}
 */
export function tryAnimation(player: alt.Player, objective: Objective) {
    if (Overrides.tryAnimation) {
        return Overrides.tryAnimation(player, objective);
    }

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
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Objective} objective
 * @return {void}
 */
export function tryAttach(player: alt.Player, objective: Objective) {
    if (Overrides.tryAttach) {
        return Overrides.tryAttach(player, objective);
    }

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

interface JobTriggerFuncs {
    tryEventCall: typeof tryEventCall;
    tryAnimation: typeof tryAnimation;
    tryAttach: typeof tryAttach;
}

const Overrides: Partial<JobTriggerFuncs> = {};

export function override(functionName: 'tryEventCall', callback: typeof tryEventCall);
export function override(functionName: 'tryAnimation', callback: typeof tryAnimation);
export function override(functionName: 'tryAttach', callback: typeof tryAttach);
/**
 * Used to override job objective trigger functionality
 *
 *
 * @param {keyof JobTriggerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof JobTriggerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
