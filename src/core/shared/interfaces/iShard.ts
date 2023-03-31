/**
 * Used to display a 'wasted'-like screen from server to client.
 *
 *
 * @interface IShard
 */
export default interface IShard {
    /**
     * How long in milliseconds this shard should last.
     * Use -1 to set forever.
     * @type {number}
     *
     */
    duration: number;

    /**
     * The large text to display.
     * @type {string}
     *
     */
    title: string;

    /**
     * The text below the title. Optional.
     * @type {string}
     *
     */
    text?: string;
}
