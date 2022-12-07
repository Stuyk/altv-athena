import * as alt from 'alt-client';

export interface StaticTextInfo {
    /**
     * The unique identifier for this drawable.
     *
     * @type {string}
     * @memberof StaticText
     */
    uid: string;

    /**
     * The name to display on-screen.
     *
     * @type {string}
     * @memberof StaticText
     */
    text: string;

    /**
     * The position on where to display this text.
     *
     * @type {alt.IVector3}
     * @memberof StaticText
     */
    position: alt.IVector3;

    /**
     * Maximum distance for viewing text.
     *
     * @type {number}
     * @memberof StaticText
     */
    distance: number;
}
