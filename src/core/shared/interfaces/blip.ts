import * as alt from 'alt-shared';
import { BLIP_COLOR } from '../enums/blipColor.js';

/**
 * Used when passing a blip from server-side to client-side.
 *
 *
 * @interface Blip
 */
export interface Blip {
    /**
     * The 3D position of the blip on the map.
     * @type {Vector3}
     *
     */
    pos: alt.IVector3;

    /**
     * Set this to true if you don't want it on the map all of the time.
     * @type {boolean}
     *
     */
    shortRange: boolean;

    /**
     * The blip appearance which is known as a 'sprite'.
     * Do not use `1` as it can have side effects.
     * https://docs.fivem.net/docs/game-references/blips/
     * @type {number}
     *
     */
    sprite: number;

    /**
     * The color of this
     * @type {number}
     *
     */
    color: BLIP_COLOR | number;

    /**
     * The text / name of this blip. Can be whatever.
     * @type {string}
     *
     */
    text: string;

    /**
     * The scale of this blip.
     * @type {number}
     *
     */
    scale: number;

    /**
     * Another identifier field for the blip.
     * 1 = No Text on blip or Distance
     * 2 = Text on blip
     * 3 = No text, just distance
     * 7 = Other players %name% (%distance%)
     * 10 = Property
     * 11 = Occupied property
     * 12+ No Text on blip or distance
     * @type {number}
     *
     */
    category?: number;

    /**
     * An identifier for the blip.
     * @type {string}
     *
     */
    identifier?: string;

    /**
     * Another identifier field for the blip.
     * @type {string}
     *
     */
    uid?: string;
}
