import * as Athena from '@AthenaServer/api';
import { Objective, ObjectiveCriteria, ObjectiveType } from '@AthenaShared/interfaces/job';
import { Job } from './system';

export interface DefaultCriteriaOptions {
    /**
     * This objective cannot be completed in a vehicle.
     *
     * @type {boolean}
     * @memberof DefaultCriteriaOptions
     */
    NO_VEHICLE?: boolean;

    /**
     * This objective cannot be completed with a weapon in-hand.
     *
     * @type {boolean}
     * @memberof DefaultCriteriaOptions
     */
    NO_WEAPON?: boolean;

    /**
     * This objective cannot be completed if the player has died.
     *
     * @type {boolean}
     * @memberof DefaultCriteriaOptions
     */
    NO_DYING?: boolean;

    /**
     * This objective can only be completed in any vehicle.
     *
     * @type {boolean}
     * @memberof DefaultCriteriaOptions
     */
    IN_VEHICLE?: boolean;

    /**
     * This objective can only in a job vehicle
     *
     * @type {boolean}
     * @memberof DefaultCriteriaOptions
     */
    IN_JOB_VEHICLE?: boolean;

    /**
     * This job fails when the objective vehicle is destroyed.
     *
     * @type {boolean}
     * @memberof DefaultCriteriaOptions
     */
    FAIL_ON_JOB_VEHICLE_DESTROY?: boolean;

    /**
     * The job vehicle must be nearby to complete this objective.
     *
     * @type {boolean}
     * @memberof DefaultCriteriaOptions
     */
    JOB_VEHICLE_NEARBY?: boolean;

    /**
     * The vehicle engine must be off to complete this objective.
     *
     * @type {boolean}
     * @memberof DefaultCriteriaOptions
     */
    VEHICLE_ENGINE_OFF?: boolean;
}

/**
 * Cleanly creates an objective to add to a job.
 *
 * Removes all deep refs.
 *
 * @export
 * @param {Job} job
 * @param {Objective} objective
 * @returns {Objective} Returns the objective instance; does not need to be added.
 */
export function createAndAdd(job: Job, objective: Objective): Objective {
    const newObjective = Athena.systems.job.utility.cloneObjective(objective);
    job.addObjective(newObjective);
    return newObjective;
}

/**
 * Builds a numerical representation of the flags used to check job criteria.
 *
 * @export
 * @param {DefaultCriteriaOptions} criteria
 * @return {number}
 */
export function buildCriteria(criteria: DefaultCriteriaOptions): number {
    let flags = 0;

    Object.keys(criteria).forEach((key) => {
        if (!criteria[key]) {
            return;
        }

        if (typeof ObjectiveCriteria[key] === 'undefined') {
            return;
        }

        flags += ObjectiveCriteria[key];
    });

    return flags;
}

/**
 * Returns the numerical representation of a default objective type.
 *
 * @export
 * @param {keyof typeof ObjectiveType} type
 * @return {number}
 */
export function getType(type: keyof typeof ObjectiveType): number {
    return ObjectiveType[String(type)];
}
