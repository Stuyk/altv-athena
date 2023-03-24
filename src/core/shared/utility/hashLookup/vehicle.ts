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
export function hash(hash: number): object {
    var vehicleModel = vehicles.find((p) => p.Hash == hash);

    return vehicleModel;
}

/**
 * Get the name corresponding to a signed hash.
 *
 * @export
 * @param {number} hash
 * @return {object}
 */
export function signedHash(hash: number): object {
    var vehicleModel = vehicles.find((p) => p.SignedHash == hash);

    return vehicleModel;
}

/**
 * Get the name corresponding to a hex hash.
 *
 * @export
 * @param {number} hash
 * @return {object}
 */
export function hexHash(hash: string): object {
    var vehicleModel = vehicles.find((p) => p.HexHash == hash);

    return vehicleModel;
}

export default {
    hash,
    signedHash,
    hexHash,
};
