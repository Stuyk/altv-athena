/**
 * A unique interface to show the player.
 * Has custom header, summary, and image support.
 * @export
 * @interface JobTrigger
 */
export interface JobTrigger<T = {}> {
    /**
     * An external https:// based image to show for your job.
     * @type {string}
     * @memberof JobTrigger
     */
    image: string;

    /**
     * The header text of the job trigger.
     * @type {string}
     * @memberof JobTrigger
     */
    header: string;

    /**
     * A summary describing what will be done during a job.
     * @type {string}
     * @memberof JobTrigger
     */
    summary: string;

    /**
     * Event to trigger when it is accepted.
     * Recieve this event with 'alt.on'
     * @type {string}
     * @memberof JobTrigger
     */
    event?: string;

    /**
     * Event to trigger when the player declines this job.
     * Completely optional.
     * @type {string}
     * @memberof JobTrigger
     */
    cancelEvent?: string;

    /**
     * A callback if the trigger is accepted.
     *
     * @memberof JobTrigger
     */
    acceptCallback?: (player: T) => void;

    /**
     * A callback if the trigger is declined.
     *
     * @memberof JobTrigger
     */
    cancelCallback?: (player: T) => void;
}
