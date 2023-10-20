import { PED_TYPE } from '@AthenaShared/enums/pedInformationFlags.js';

/**
 * Interface for working with / using peds.
 * @export
 * @interface PedInfo
 */

export interface PedInfo {
    /**
     * The model of the ped.
     * @type {string}
     * @memberof PedInfo
     */
    name: string;

    /**
     * The hash of this ped model.
     * @type {number}
     * @memberof PedInfo
     */
    hash: number;

    /**
     * The signed hash of this ped model.
     * @type {number}
     * @memberof PedInfo
     */
    signedHash: number;

    /**
     * The hex hash of this ped model.
     * @type {string}
     * @memberof PedInfo
     */
    hexHash: string;

    /**
     * The ped type;
     * @type {PED_TYPE}
     * @memberof PedInfo
     */
    pedType: PED_TYPE;
}
