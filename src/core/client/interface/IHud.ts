import * as alt from 'alt-client';

export default interface IHUD {
    /**
     * A unique identifier to add / remove a HUD element.
     * @type {string}
     * @memberof IHUD
     */
    identifier: string;

    /**
     * The Relative Percentage Position on Screen
     * 0.1 - 1
     * @type {{
     *         x: number;
     *         y: number;
     *     }}
     * @memberof IHUD
     */
    position: {
        x: number;
        y: number;
    };

    /**
     * Padding to apply to edges if justified left or right.
     * @type {number}
     * @memberof IHUD
     */
    padding: number;

    /**
     * Text Justification / Alignment
     * 0 Center, 1 Left, 2 Right
     * @type {number}
     * @memberof IHUD
     */
    align: number;

    /**
     * The Scale of the Text
     * 0.6 is Usually Pretty Good
     * @type {number}
     * @memberof IHUD
     */
    scale: number;

    /**
     * Default Color of Text
     * @type {alt.RGBA}
     * @memberof IHUD
     */
    color: alt.RGBA;

    /**
     * A callback function that should return a string value for your HUD.
     * @memberof IHUD
     */
    callback: (position: { x: number; y: number }, scale: number) => string;

    /**
     * Should this only display inside of a vehicle?
     * @type {boolean}
     * @memberof IHUD
     */
    isVehicle?: boolean;
}
