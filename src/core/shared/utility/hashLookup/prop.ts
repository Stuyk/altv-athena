import { peds } from '@AthenaShared/information/hash-lookup/peds';

/**
 * Get the name corresponding to a hash.
 *
 * @export
 * @param {number} hash
 * @return {object}
 */
function pedFromHash(hash: number): object {
    var pedModel = peds.find((p) => p.Hash == hash);

    return pedModel;
}

export default {
    pedFromHash,
};
