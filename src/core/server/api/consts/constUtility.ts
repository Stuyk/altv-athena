import { deepCloneObject } from '@AthenaShared/utility/deepCopy';
import { hashConst } from './constHash';
import { vectorConst } from './constVector';
import { isFlagEnabled } from '@AthenaShared/utility/flags';
import { getClosestPlayer, getClosestVehicle } from '@AthenaServer/utility/closest';

export const utilityConst = {
    hash: hashConst,
    vector: vectorConst,
    deepCloneObject,
    isFlagEnabled,
    getClosestPlayer,
    getClosestVehicle,
};
