import { Objective } from '@AthenaShared/interfaces/job';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy';

/**
 * Cleanly clones an objective and rebinds all callbacks.
 *
 * @export
 * @param {Objective} objectiveData
 * @return {Objective}
 */
export function cloneObjective(objectiveData: Objective): Objective {
    const callbackOnStart = objectiveData.callbackOnStart;
    const callbackOnFinish = objectiveData.callbackOnFinish;
    const callbackOnCheck = objectiveData.callbackOnCheck;
    const objectiveClone = deepCloneObject<Objective>(objectiveData);
    objectiveClone.callbackOnStart = callbackOnStart;
    objectiveClone.callbackOnFinish = callbackOnFinish;
    objectiveClone.callbackOnCheck = callbackOnCheck;
    return objectiveClone;
}
