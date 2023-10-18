import { SPINNER_TYPE } from '../enums/spinnerType.js';

/**
 * Used to show a spinner in the bottom right corner of the screen.
 *
 * Used when passing from server to client.
 *
 *
 * @interface ISpinner
 */
export default interface ISpinner {
    /**
     * How long in milliseconds this spinner should last.
     * Use -1 to set forever.
     * @type {number}
     *
     */
    duration: number;

    /**
     * The text this spinner should have beside it.
     * @type {string}
     *
     */
    text: string;

    /**
     * The type of spinner to use.
     * @type {number | SPINNER_TYPE}
     *
     */
    type?: number | SPINNER_TYPE;
}
