/**
 * Used in the job system to invoke various detached events.
 *
 *
 * @interface EventCall
 */
export interface EventCall {
    /**
     * The name of the event to call.
     * ie. 'openTrunk'
     *
     * @type {string}
     *
     */
    eventName: string;

    /**
     * Does this event get emitted to the server?
     * Only useful for client-side.
     *
     * Use alt.on to get this event if set to false.
     * Must be entirely client-side or entirely server-side if false.
     * @type {boolean}
     *
     */
    isServer: boolean;

    /**
     * Used to call an event right when an objective is started.
     * Only useful for the job system.
     * @type {boolean}
     *
     */
    callAtStart?: boolean;
}
