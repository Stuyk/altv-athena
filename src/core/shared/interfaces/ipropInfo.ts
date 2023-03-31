/**
 * Interface for working with / using props.
 * @export
 * @interface PropInfo
 */

export interface PropInfo {
    /**
     * The model of the prop.
     * @type {string}
     * @memberof PropInfo
     */
    name: string;

    /**
     * The hash of this prop model.
     * @type {number}
     * @memberof PropInfo
     */
    hash: number;

    /**
     * The signed hash of this prop model.
     * @type {number}
     * @memberof PropInfo
     */
    signedHash: number;

    /**
     * The hex hash of this prop model.
     * @type {string}
     * @memberof PropInfo
     */
    hexHash: string;
}
