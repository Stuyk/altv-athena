import { Objective } from '@AthenaShared/interfaces/job.js';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy.js';

/**
 * Cleanly clones an objective and rebinds all callbacks.
 *
 *
 * @param {Objective} objectiveData
 * @return {Objective}
 */
export function cloneObjective(objectiveData: Objective): Objective {
    if (Overrides.cloneObjective) {
        return Overrides.cloneObjective(objectiveData);
    }

    const callbackOnStart = objectiveData.callbackOnStart;
    const callbackOnFinish = objectiveData.callbackOnFinish;
    const callbackOnCheck = objectiveData.callbackOnCheck;
    const objectiveClone = deepCloneObject<Objective>(objectiveData);
    objectiveClone.callbackOnStart = callbackOnStart;
    objectiveClone.callbackOnFinish = callbackOnFinish;
    objectiveClone.callbackOnCheck = callbackOnCheck;
    return objectiveClone;
}

interface JobUtilityFuncs {
    cloneObjective: typeof cloneObjective;
}

const Overrides: Partial<JobUtilityFuncs> = {};

export function override(functionName: 'cloneObjective', callback: typeof cloneObjective);
/**
 * Used to override job objective trigger functionality
 *
 *
 * @param {keyof JobUtilityFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof JobUtilityFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
