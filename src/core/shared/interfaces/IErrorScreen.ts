export default interface IErrorScreen {
    /**
     * Large Text
     * @type {string}
     * @memberof
     */
    title: string;

    /**
     * Text below title.
     * @type {string}
     * @memberof
     */
    text: string;

    /**
     * Text below other text option.
     * @type {string}
     * @memberof
     */
    text2?: string;

    /**
     * How long should this display for in milliseconds.
     * Use -1 to set forever.
     * @type {number}
     * @memberof
     */
    duration: number;
}
