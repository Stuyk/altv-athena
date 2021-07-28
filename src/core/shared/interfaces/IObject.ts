import { Vector3 } from './Vector';

export interface IObject {
    pos: Vector3;
    model: string;
    maxDistance?: number;
    uid?: string;

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
}
