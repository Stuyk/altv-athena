import * as alt from 'alt-shared';

export interface Door {
    /**
     * Unique identifier for this door.
     *
     * @type {string}
     *
     */
    uid: string;

    /**
     * A description of this doors location.
     *
     * @type {string}
     *
     */
    description?: string;

    /**
     * Current position of the door.
     *
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * The door hash of the door.
     *
     * @type {number}
     *
     */
    model: number;

    /**
     * Should this door be locked?
     *
     * @type {boolean}
     *
     */
    isUnlocked: boolean;
}
