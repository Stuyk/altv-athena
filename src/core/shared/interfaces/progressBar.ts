import * as alt from 'alt-shared';

export interface ProgressBar {
    /**
     * A unique identifier to remove the progress bar early.
     * @type {string}
     * @memberof ProgressBar
     */
    uid?: string;

    /**
     * The position in a 3D space to show the progress bar.
     * Only a single client will see it.
     * @type {{ x: number; y: number; z: number }}
     * @memberof ProgressBar
     */
    position: { x: number; y: number; z: number };

    /**
     * The color of the progress bar.
     * @type {alt.RGBA}
     * @memberof ProgressBar
     */
    color: alt.RGBA;

    /**
     * How long this progress bar should last.
     * @type {number}
     * @memberof ProgressBar
     */
    milliseconds: number;

    /**
     * The distance in which the progress bar can be seen.
     * @type {number}
     * @memberof ProgressBar
     */
    distance: number;

    /**
     * The text to display on the progress bar.
     * @type {string}
     * @memberof ProgressBar
     */
    text?: string;

    percentageEnabled?: boolean;

    /**
     * Do not set this. Leave it alone.
     * @type {number}
     * @memberof ProgressBar
     */
    startTime?: number;

    /**
     * Do not set this. Leave it alone.
     * @type {number}
     * @memberof ProgressBar
     */
    finalTime?: number;
}
