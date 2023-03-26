import * as alt from 'alt-client';

export interface StaticTextInfo {
    /**
     * The unique identifier for this drawable.
     *
     * @type {string}
     *
     */
    uid: string;

    /**
     * The name to display on-screen.
     *
     * @type {string}
     *
     */
    text: string;

    /**
     * The position on where to display this text.
     *
     * @type {alt.IVector3}
     *
     */
    position: alt.IVector3;

    /**
     * Maximum distance for viewing text.
     *
     * @type {number}
     *
     */
    distance: number;
}
