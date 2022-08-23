import { Vector3 } from './vector';

export default interface IAttachable {
    /**
     * The unique identifier for this attachable.
     * @type {string}
     * @memberof IAttachable
     */
    uid?: string;

    /**
     * The model or object of the attachable.
     * @type {string}
     * @memberof IAttachable
     */
    model: string;

    /**
     * The position where the object should be attached.
     * @type {Vector3}
     * @memberof IAttachable
     */
    pos: Vector3;

    /**
     * The rotation where the object should be attached.
     * @type {Vector3}
     * @memberof IAttachable
     */
    rot: Vector3;

    /**
     * Where to begin attaching the object.
     * If this is not defined it will be around center position of the player it is attached to.
     * @type {number}
     * @memberof IAttachable
     */
    bone: number;

    /**
     * Do not define this. Leave it alone.
     * @type {number}
     * @memberof IAttachable
     */
    clientObjectID?: number;
}

export interface JobAttachable extends IAttachable {
    /**
     * How long should this object be attached.
     * Set this to -1 for infinite.
     * @type {number}
     * @memberof Attachable
     */
    duration?: number;

    /**
     * Attach the object when the objective is loaded?
     * @type {boolean}
     * @memberof JobAttachable
     */
    atObjectiveStart?: boolean;
}
