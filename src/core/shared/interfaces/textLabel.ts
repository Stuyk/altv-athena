import * as alt from 'alt-shared';

/**
 * Used to describe a text label. Passed from server to client.
 *
 *
 * @interface TextLabel
 */
export interface TextLabel {
    /**
     * The position where to place the TextLabel in a 3D space.
     * @type {alt.IVector3}
     *
     */
    pos: alt.IVector3;

    /**
     * The 'Text' to show on this text label.
     * @type {string}
     *
     */
    text: string;

    /**
     * The maximum distance this text label should render at.
     * @type {number}
     *
     */
    maxDistance?: number;

    /**
     * The unique identifier to remove this text label if necessary.
     * @type {string}
     *
     */
    uid?: string;

    /**
     * The dimension to show this text label in.
     * @type {number}
     *
     */
    dimension?: number;

    /**
     * Always set to true when creating a server-wide text label.
     *
     * @type {boolean}
     *
     */
    isServerWide?: boolean;
}
