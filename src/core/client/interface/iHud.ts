import * as alt from 'alt-client';
import { HUD_IDENTIFIER } from '../../shared/enums/hudIdentifiers';

export default interface IHUD {
    /**
     * A unique identifier to add / remove a HUD element.
     * @type {string}
     * @memberof IHUD
     */
    identifier: HUD_IDENTIFIER | string;

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
     * Skip the callback and do nothing with it.
     * @type {boolean}
     * @memberof IHUD
     */
    disabled?: boolean;

    /**
     * When this function is applied it will take the data from the HUD
     * and re-route it into a different function.
     *
     * Instead of drawing the HUD normally.
     *
     * Think of it as the overwrite function.
     * @memberof IHUD
     */
    callbackReroute?: (...args: any[]) => void;

    /**
     * A callback function that should return a string value for your HUD.
     * @memberof IHUD
     */
    callback: (self: IHUD, position: { x: number; y: number }, scale: number) => string | number | boolean | void;

    /**
     * Should this only display inside of a vehicle?
     * @type {boolean}
     * @memberof IHUD
     */
    isVehicle?: boolean;

    /**
     * Is return only?
     * Meaning should this callback have a value returned so we can push it elsewhere
     * @type {boolean}
     * @memberof IHUD
     */
    isReturnOnly?: boolean;
}
