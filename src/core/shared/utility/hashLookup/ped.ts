import { vehicles } from '@AthenaShared/information/hash-lookup/vehicles';
import { peds } from '@AthenaShared/information/hash-lookup/peds';
import { textures } from '@AthenaShared/information/hash-lookup/textures';
import { props } from '@AthenaShared/information/hash-lookup/props';

/**
 * Get the name corresponding to a hash.
 *
 * @export
 * @param {number} hash
 * @return {object}
 */
function vehicleFromHash(hash: number): object {
    var vehicleModel = vehicles.find((p) => p.Hash == hash);

    return vehicleModel;
}

export default {
    vehicleFromHash,
};
