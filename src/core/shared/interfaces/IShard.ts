export default interface IShard {
    /**
     * How long in milliseconds this shard should last.
     * Use -1 to set forever.
     * @type {number}
     * @memberof IShard
     */
    duration: number;

    /**
     * The large text to display.
     * @type {string}
     * @memberof IShard
     */
    title: string;

    /**
     * The text below the title. Optional.
     * @type {string}
     * @memberof ISpinner
     */
    text?: string;
}
