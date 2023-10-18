import { CREDIT_ALIGN } from '../enums/creditAlign.js';

/**
 * Used when passing custom 'credit' overlays from server to client.
 *
 *
 * @interface ICredit
 */
export default interface ICredit {
    /**
     * Larger blue text to display.
     * CANNOT use GTA Colors like ~r~
     * @type {string}
     *
     */
    role: string;

    /**
     * Text below the role.
     * Can use GTA Colors.
     * @type {string}
     *
     */
    name: string;

    /**
     * How long should this display for in milliseconds.
     * Use -1 to set forever.
     * @type {number}
     *
     */
    duration: number;

    /**
     * The alignment of the credits. Defaults to left.
     * @type {CREDIT_ALIGN}
     *
     */
    align?: string | CREDIT_ALIGN;
}
