import { propData } from '@AthenaShared/information/props.js';
import { PropInfo } from '@AthenaShared/interfaces/ipropInfo.js';

/**
 * Get the PropInfo corresponding to a hash.
 *
 * @export
 * @param {number} hash
 * @return {PropInfo}
 */
function hash(hash: number): PropInfo {
    var propModel = propData.find((p) => p.hash == hash);

    return propModel;
}

/**
 * Get the PropInfo corresponding to a signed hash.
 *
 * @export
 * @param {number} hash
 * @return {PropInfo}
 */
export function signedHash(hash: number): PropInfo {
    var propModel = propData.find((p) => p.signedHash == hash);

    return propModel;
}

/**
 * Get the PropInfo corresponding to a hex hash.
 *
 * @export
 * @param {number} hash
 * @return {PropInfo}
 */
export function hexHash(hash: string): PropInfo {
    var propModel = propData.find((p) => p.hexHash == hash);

    return propModel;
}

export default {
    hash,
    signedHash,
    hexHash,
};
