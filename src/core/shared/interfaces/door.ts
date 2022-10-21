import * as alt from 'alt-shared';

export interface Door {
    /**
     * Unique identifier for this door.
     *
     * @type {string}
     * @memberof Door
     */
    uid: string;

    /**
     * A description of this doors location.
     *
     * @type {string}
     * @memberof Door
     */
    description?: string;

    /**
     * Current position of the door.
     *
     * @type {alt.IVector3}
     * @memberof Door
     */
    pos: alt.IVector3;

    /**
     * The door hash of the door.
     *
     * @type {number}
     * @memberof Door
     */
    model: number;

    /**
     * Should this door be locked?
     *
     * @type {boolean}
     * @memberof Door
     */
    isUnlocked: boolean;
}
