import { PedBone } from '@AthenaShared/enums/boneIds';
import * as alt from 'alt-shared';

/**
 * Used in the attachement system when attaching objects to a player.
 *
 *
 * @interface IAttachable
 */
export default interface IAttachable {
    /**
     * The unique identifier for this attachable.
     * @type {string}
     *
     */
    uid?: string;

    /**
     * The model or object of the attachable.
     * @type {string}
     *
     */
    model: string;

    /**
     * The position where the object should be attached.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * The rotation where the object should be attached.
     * @type {alt.IVector3}
     *
     */
    rot: alt.IVector3;

    /**
     * Where to begin attaching the object.
     *
     * If this is not defined it will be around center position of the player it is attached to.
     *
     * This is a 'Bone ID' and not a 'Bone Index'
     *
     * Use the PedBone enum provided in Athena for correct value
     *
     * @type {number}
     *
     */
    bone: PedBone;

    /**
     * Do not define this. Leave it alone.
     * @type {number}
     *
     */
    entityID?: number;
}

export interface JobAttachable extends IAttachable {
    /**
     * How long should this object be attached.
     * Set this to -1 for infinite.
     * @type {number}
     *
     */
    duration?: number;

    /**
     * Attach the object when the objective is loaded?
     * @type {boolean}
     *
     */
    atObjectiveStart?: boolean;
}
