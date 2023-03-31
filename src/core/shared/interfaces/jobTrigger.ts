/**
 * A unique interface to show the player.
 * Has custom header, summary, and image support.
 *
 * @interface JobTrigger
 */
export interface JobTrigger<T = {}> {
    /**
     * An external https:// based image to show for your job.
     * @type {string}
     *
     */
    image: string;

    /**
     * The header text of the job trigger.
     * @type {string}
     *
     */
    header: string;

    /**
     * A summary describing what will be done during a job.
     * @type {string}
     *
     */
    summary: string;

    /**
     * Maximum amount for quantity input.
     * @type {string}
     *
     */
    maxAmount?: number;

    /**
     * Event to trigger when it is accepted.
     * Recieve this event with 'alt.on'
     * @type {string}
     *
     */
    event?: string;

    /**
     * Event to trigger when the player declines this job.
     * Completely optional.
     * @type {string}
     *
     */
    cancelEvent?: string;

    /**
     * A callback if the trigger is accepted.
     *
     *
     */
    acceptCallback?: (player: T, amount?: number) => void;

    /**
     * A callback if the trigger is declined.
     *
     *
     */
    cancelCallback?: (player: T) => void;
}
