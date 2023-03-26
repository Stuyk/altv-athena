import * as alt from 'alt-shared';

/**
 * Used to create and show a progress bar. Used in server to client.
 *
 *
 * @interface ProgressBar
 */
export interface ProgressBar {
    /**
     * A unique identifier to remove the progress bar early.
     * @type {string}
     *
     */
    uid?: string;

    /**
     * The position in a 3D space to show the progress bar.
     * Only a single client will see it.
     * @type {{ x: number; y: number; z: number }}
     *
     */
    position: { x: number; y: number; z: number };

    /**
     * The color of the progress bar.
     * @type {alt.RGBA}
     *
     */
    color: alt.RGBA;

    /**
     * How long this progress bar should last.
     * @type {number}
     *
     */
    milliseconds: number;

    /**
     * The distance in which the progress bar can be seen.
     * @type {number}
     *
     */
    distance: number;

    /**
     * The text to display on the progress bar.
     * @type {string}
     *
     */
    text?: string;

    percentageEnabled?: boolean;

    /**
     * Do not set this. Leave it alone.
     * @type {number}
     *
     */
    startTime?: number;

    /**
     * Do not set this. Leave it alone.
     * @type {number}
     *
     */
    finalTime?: number;
}
