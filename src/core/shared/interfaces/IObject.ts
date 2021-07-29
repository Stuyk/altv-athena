import { Vector3 } from './Vector';

export interface IObject {
    pos: Vector3;
    model: string;
    rot?: Vector3;
    maxDistance?: number;
    uid: string;

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
     * Is this object interior only.
     * Will only show in a matching interior dimension.
     * @type {boolean}
     * @memberof IObject
     */
    isInterior?: boolean;

    /**
     * Will show across all dimensions.
     * @type {number}
     * @memberof IObject
     */
    dimension?: number;
}
