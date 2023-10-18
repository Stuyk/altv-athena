import * as Athena from '@AthenaServer/api/index.js';
import { Objective, ObjectiveCriteria, ObjectiveType } from '@AthenaShared/interfaces/job.js';
import { Job } from './system.js';

export interface DefaultCriteriaOptions {
    /**
     * This objective cannot be completed in a vehicle.
     *
     * @type {boolean}
     *
     */
    NO_VEHICLE?: boolean;

    /**
     * This objective cannot be completed with a weapon in-hand.
     *
     * @type {boolean}
     *
     */
    NO_WEAPON?: boolean;

    /**
     * This objective cannot be completed if the player has died.
     *
     * @type {boolean}
     *
     */
    NO_DYING?: boolean;

    /**
     * This objective can only be completed in any vehicle.
     *
     * @type {boolean}
     *
     */
    IN_VEHICLE?: boolean;

    /**
     * This objective can only in a job vehicle
     *
     * @type {boolean}
     *
     */
    IN_JOB_VEHICLE?: boolean;

    /**
     * This job fails when the objective vehicle is destroyed.
     *
     * @type {boolean}
     *
     */
    FAIL_ON_JOB_VEHICLE_DESTROY?: boolean;

    /**
     * The job vehicle must be nearby to complete this objective.
     *
     * @type {boolean}
     *
     */
    JOB_VEHICLE_NEARBY?: boolean;

    /**
     * The vehicle engine must be off to complete this objective.
     *
     * @type {boolean}
     *
     */
    VEHICLE_ENGINE_OFF?: boolean;
}

/**
 * Cleanly creates an objective to add to a job.
 *
 * Removes all deep refs.
 *
 *
 * @param {Job} job
 * @param {Objective} objective
 * @returns {Objective} Returns the objective instance; does not need to be added.
 */
export function createAndAdd(job: Job, objective: Objective): Objective {
    if (Overrides.createAndAdd) {
        return Overrides.createAndAdd(job, objective);
    }

    const newObjective = Athena.systems.job.utility.cloneObjective(objective);
    job.addObjective(newObjective);
    return newObjective;
}

/**
 * Builds a numerical representation of the flags used to check job criteria.
 *
 *
 * @param {DefaultCriteriaOptions} criteria
 * @return {number}
 */
export function buildCriteria(criteria: DefaultCriteriaOptions): number {
    if (Overrides.buildCriteria) {
        return Overrides.buildCriteria(criteria);
    }

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
 *
 * @param {keyof typeof ObjectiveType} type
 * @return {number}
 */
export function getType(type: keyof typeof ObjectiveType): number {
    if (Overrides.getType) {
        return Overrides.getType(type);
    }

    return ObjectiveType[String(type)];
}

interface JobObjectiveFuncs {
    createAndAdd: typeof createAndAdd;
    buildCriteria: typeof buildCriteria;
    getType: typeof getType;
}

const Overrides: Partial<JobObjectiveFuncs> = {};

export function override(functionName: 'createAndAdd', callback: typeof createAndAdd);
export function override(functionName: 'buildCriteria', callback: typeof buildCriteria);
export function override(functionName: 'getType', callback: typeof getType);
/**
 * Used to override job objective creation functionality
 *
 *
 * @param {keyof JobObjectiveFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof JobObjectiveFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
