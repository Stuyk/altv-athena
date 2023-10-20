import { pedData } from '@AthenaShared/information/peds.js';
import { PedInfo } from '@AthenaShared/interfaces/iPedInfo.js';

/**
 * Get the PedInfo corresponding to a hash.
 *
 * @export
 * @param {number} hash
 * @return {PedInfo}
 */
function hash(hash: number): PedInfo {
    var pedModel = pedData.find((p) => p.hash == hash);

    return pedModel;
}

/**
 * Get the PedInfo corresponding to a signed hash.
 *
 * @export
 * @param {number} hash
 * @return {PedInfo}
 */
export function signedHash(hash: number): PedInfo {
    var pedModel = pedData.find((p) => p.signedHash == hash);

    return pedModel;
}

/**
 * Get the PedInfo corresponding to a hex hash.
 *
 * @export
 * @param {number} hash
 * @return {PedInfo}
 */
export function hexHash(hash: string): PedInfo {
    var pedModel = pedData.find((p) => p.hexHash == hash);

    return pedModel;
}

export default {
    hash,
    signedHash,
    hexHash,
};
