import { CREDIT_ALIGN } from '../enums/creditAlign';

export default interface ICredit {
    /**
     * Larger blue text to display.
     * CANNOT use GTA Colors like ~r~
     * @type {string}
     * @memberof
     */
    role: string;

    /**
     * Text below the role.
     * Can use GTA Colors.
     * @type {string}
     * @memberof
     */
    name: string;

    /**
     * How long should this display for in milliseconds.
     * Use -1 to set forever.
     * @type {number}
     * @memberof
     */
    duration: number;

    /**
     * The alignment of the credits. Defaults to left.
     * @type {CREDIT_ALIGN}
     * @memberof ICredit
     */
    align?: string | CREDIT_ALIGN;
}
