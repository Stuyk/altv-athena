import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { Objective, ObjectiveCriteria, ObjectiveEvents, ObjectiveType } from '@AthenaShared/interfaces/job.js';
import { isFlagEnabled } from '@AthenaShared/utility/flags.js';
import { Job } from './system.js';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy.js';

const criteriaAddons: Array<(player: alt.Player, objective: Objective) => boolean> = [];
const typeAddons: Array<(player: alt.Player, objective: Objective) => boolean> = [];

/**
 * Verifies all objective content / functionality.
 *
 *
 * @param {Job} job
 * @return {Promise<boolean>}
 */
export async function objective(job: Job): Promise<boolean> {
    if (Overrides.objective) {
        return Overrides.objective(job);
    }

    const objective = job.getCurrentObjective();
    if (!objective) {
        return false;
    }

    const player = job.getPlayer();
    if (!player || !player.valid) {
        return false;
    }

    // Skip all default checks if this is set to true.
    if (!objective.onlyCallbackCheck) {
        const passedCritera = Athena.systems.job.verify.criteria(player, objective);
        if (!passedCritera) {
            return false;
        }

        const passedType = Athena.systems.job.verify.type(player, objective);
        if (!passedType) {
            return false;
        }
    }

    // Allows for custom callback check
    if (objective.callbackOnCheck && typeof objective.callbackOnCheck === 'function') {
        const didPass = await objective.callbackOnCheck(player);
        if (!didPass) {
            return false;
        }
    }

    // Triggers an Animation at Objective End
    if (objective.animation && !objective.animation.atObjectiveStart) {
        Athena.systems.job.triggers.tryAnimation(player, objective);
    }

    if (objective.attachable && !objective.attachable.atObjectiveStart) {
        Athena.systems.job.triggers.tryAttach(player, objective);
    }

    // Calls an event on server-side or client-side after objective is complete.
    if (objective.eventCall && !objective.eventCall.callAtStart) {
        Athena.systems.job.triggers.tryEventCall(player, objective);
    }

    if (objective.particle) {
        Athena.player.emit.particle(player, objective.particle, true);
    }

    await job.goToNextObjective();
    return true;
}

/**
 * Verifies job criteria such as not being in a vehicle, no weapons, etc.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Objective} objective
 * @return {boolean}
 */
export function criteria(player: alt.Player, objective: Objective): boolean {
    if (Overrides.criteria) {
        return Overrides.criteria(player, objective);
    }

    if (isFlagEnabled(objective.criteria, ObjectiveCriteria.NO_VEHICLE)) {
        if (player && player.vehicle) {
            return false;
        }
    }

    if (isFlagEnabled(objective.criteria, ObjectiveCriteria.NO_WEAPON)) {
        if (player.weapons.length >= 1) {
            return false;
        }
    }

    if (isFlagEnabled(objective.criteria, ObjectiveCriteria.NO_DYING)) {
        const data = Athena.document.character.get(player);

        if (player && data.isDead) {
            return false;
        }
    }

    if (isFlagEnabled(objective.criteria, ObjectiveCriteria.IN_VEHICLE)) {
        if (player && !player.vehicle) {
            return false;
        }
    }

    // Check if the player is in a specific job vehicle or any job vehicle.
    if (isFlagEnabled(objective.criteria, ObjectiveCriteria.IN_JOB_VEHICLE)) {
        if (player && !player.vehicle) {
            return false;
        }

        let isInJobVehicle = false;
        const job = Athena.systems.job.instance.get(player);
        if (typeof job === 'undefined') {
            return false;
        }

        const vehicles = job.getVehicles();
        for (let itr of vehicles) {
            if (!itr.vehicle || !itr.vehicle.valid) {
                continue;
            }

            if (itr.vehicle.id !== player.vehicle.id) {
                continue;
            }

            isInJobVehicle = true;
        }

        if (!isInJobVehicle) {
            return false;
        }
    }

    // Called when a job vehicle is destroyed.
    if (isFlagEnabled(objective.criteria, ObjectiveCriteria.FAIL_ON_JOB_VEHICLE_DESTROY)) {
        const job = Athena.systems.job.instance.get(player);
        if (typeof job === 'undefined') {
            return false;
        }

        const vehicles = job.getVehicles();

        let allValid = true;
        for (let i = 0; i < vehicles.length; i++) {
            if (!vehicles[i].vehicle.valid) {
                continue;
            }

            if (vehicles[i].vehicle.engineHealth <= 50) {
                allValid = false;
                break;
            }

            if (vehicles[i].vehicle.destroyed) {
                allValid = false;
                break;
            }
        }

        if (!allValid) {
            return false;
        }
    }

    // Check if any vehicle is nearby.
    if (isFlagEnabled(objective.criteria, ObjectiveCriteria.JOB_VEHICLE_NEARBY)) {
        const job = Athena.systems.job.instance.get(player);
        if (typeof job === 'undefined') {
            return false;
        }

        const vehicles = job.getVehicles();

        let foundValid = false;
        for (let i = 0; i < vehicles.length; i++) {
            if (!vehicles[i].vehicle.valid) {
                continue;
            }

            const dist = Athena.utility.vector.distance2d(vehicles[i].vehicle.pos, objective.pos);
            if (dist >= 50) {
                continue;
            }

            foundValid = true;
        }

        if (!foundValid) {
            return false;
        }
    }

    // Check if is engine on in vehicle
    if (isFlagEnabled(objective.criteria, ObjectiveCriteria.VEHICLE_ENGINE_OFF)) {
        if (!player || !player.vehicle || player.vehicle.engineOn) {
            return false;
        }
    }

    for (let criteriaCallback of criteriaAddons) {
        const didPass = criteriaCallback(player, objective);

        if (objective.criteria) {
            if (!didPass) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Verifies job types such as a waypoint, or capture point.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {Objective} objective
 * @return {boolean}
 */
export function type(player: alt.Player, objective: Objective): boolean {
    if (Overrides.type) {
        return Overrides.type(player, objective);
    }

    for (let typeAddon of typeAddons) {
        const didPass = typeAddon(player, objective);
        if (!didPass) {
            return false;
        }
    }

    if (isFlagEnabled(objective.type, ObjectiveType.WAYPOINT)) {
        if (Athena.utility.vector.distance(player.pos, objective.pos) <= objective.range) {
            return true;
        }
    }

    if (isFlagEnabled(objective.type, ObjectiveType.CAPTURE_POINT)) {
        if (Athena.utility.vector.distance(player.pos, objective.pos) > objective.range) {
            return false;
        }

        if (objective.captureMaximum === null || objective.captureMaximum === undefined) {
            objective.captureMaximum = 10;
        }

        if (!objective.captureProgress) {
            objective.captureProgress = 0;
        }

        if (objective.nextCaptureTime && Date.now() < objective.nextCaptureTime) {
            return false;
        }

        if (!objective.nextCaptureTime || Date.now() > objective.nextCaptureTime) {
            objective.nextCaptureTime = Date.now() + 1000;
        }

        objective.captureProgress += 1;

        if (objective.captureProgress >= objective.captureMaximum) {
            return true;
        } else {
            const clonedObjective = deepCloneObject<Objective>(objective);
            player.emit(ObjectiveEvents.JOB_UPDATE, clonedObjective);
        }
    }

    if (isFlagEnabled(objective.type, ObjectiveType.PRESS_INTERACT_TO_COMPLETE)) {
        if (Athena.utility.vector.distance(player.pos, objective.pos) > objective.range) {
            return false;
        }
    }

    return false;
}

/**
 * Adds a custom check type to the global job system.
 *
 * * Criteria -> Defined as things like can't have weapons, or can't be on-foot, etc.
 * * Type -> Defined as things like a capture point, or jump 5 times here... etc.
 *
 * CANNOT BE ASYNC
 *
 * #### Example
 * ```
 * Athena.systems.job.verify.addCustomCheck('criteria', (player: alt.Player, objective: Objective) => {
 *     // Ignore this objective if the uid does not match.
 *     // Force it to always pass.
 *     if (objective.uid !== 'medkit-ambulance-check') {
 *         return true;
 *     }
 *
 *     if (!player || !player.vehicle) {
 *         return false;
 *     }
 *
 *     // Check if they are in a specific vehicle with a specific model
 *     if (player.vehicle.model !== alt.hash('ambulance')) {
 *         return false;
 *     }
 *
 *     // This item does not exist by default in Athena
 *     return Athena.player.inventory.has(player, 'medkit', 1);
 * });
 * ```
 *
 *
 * @param {('type' | 'criteria')} type
 * @param {(objective: Objective) => boolean} callback
 * @return {void}
 */
export function addCustomCheck(
    type: 'type' | 'criteria',
    callback: (player: alt.Player, objective: Objective) => boolean,
) {
    if (Overrides.addCustomCheck) {
        return Overrides.addCustomCheck(type, callback);
    }

    if (type === 'type') {
        typeAddons.push(callback);
        return;
    }

    if (type === 'criteria') {
        criteriaAddons.push(callback);
        return;
    }
}

interface JobVerifyFuncs {
    addCustomCheck: typeof addCustomCheck;
    type: typeof type;
    criteria: typeof criteria;
    objective: typeof objective;
}

const Overrides: Partial<JobVerifyFuncs> = {};

export function override(functionName: 'addCustomCheck', callback: typeof addCustomCheck);
export function override(functionName: 'type', callback: typeof type);
export function override(functionName: 'criteria', callback: typeof criteria);
export function override(functionName: 'objective', callback: typeof objective);
/**
 * Used to override job objective verification functionality
 *
 *
 * @param {keyof JobVerifyFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof JobVerifyFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
