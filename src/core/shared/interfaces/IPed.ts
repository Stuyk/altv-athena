import { Vector3 } from './Vector';
import { Animation } from './Animation';

export interface IPed {
    pos: Vector3;
    model: string;
    heading?: number;
    maxDistance?: number;
    uid: string;
    animations?: Animation[][];
    randomizeAppearance?: boolean;
    /**
     * Local Object ID.
     * Do not actually fill this out.
     * @type {number}
     * @memberof IObject
     */
    local?: number;

    /**
     * Local Object Info
     * Do not automatically fill this out.
     * @type {boolean}
     * @memberof IObject
     */
    isBeingCreated?: boolean;

    /**
     * Will show across all dimensions.
     * @type {number}
     * @memberof IObject
     */
    dimension?: number;


}
