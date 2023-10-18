import { VehicleData } from '@AthenaShared/information/vehicles.js';
import { VehicleInfo } from '@AthenaShared/interfaces/vehicleInfo.js';

/**
 * Get the VehicleInfo corresponding to a hash.
 *
 * @export
 * @param {number} hash
 * @return {VehicleInfo}
 */
export function hash(hash: number): VehicleInfo {
    var vehicleModel = VehicleData.find((p) => p.hash == hash);

    return vehicleModel;
}

/**
 * Get the VehicleInfo corresponding to a signed hash.
 *
 * @export
 * @param {number} hash
 * @return {VehicleInfo}
 */
export function signedHash(hash: number): VehicleInfo {
    var vehicleModel = VehicleData.find((p) => p.signedHash == hash);

    return vehicleModel;
}

/**
 * Get the VehicleInfo corresponding to a hex hash.
 *
 * @export
 * @param {number} hash
 * @return {VehicleInfo}
 */
export function hexHash(hash: string): VehicleInfo {
    var vehicleModel = VehicleData.find((p) => p.hexHash == hash);

    return vehicleModel;
}

export default {
    hash,
    signedHash,
    hexHash,
};
