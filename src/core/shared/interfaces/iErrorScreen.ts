/**
 * Used when passing error screen information from server to client.
 *
 *
 * @interface IErrorScreen
 */
export default interface IErrorScreen {
    /**
     * Large Text
     * @type {string}
     *
     */
    title: string;

    /**
     * Text below title.
     * @type {string}
     *
     */
    text: string;

    /**
     * Text below other text option.
     * @type {string}
     *
     */
    text2?: string;

    /**
     * How long should this display for in milliseconds.
     * Use -1 to set forever.
     * @type {number}
     *
     */
    duration: number;
}
