export interface EventCall {
    /**
     * The name of the event to call.
     * ie. 'openTrunk'
     *
     * @type {string}
     * @memberof EventCall
     */
    eventName: string;

    /**
     * Does this event get emitted to the server?
     * Only useful for client-side.
     *
     * Use alt.on to get this event if set to false.
     * Must be entirely client-side or entirely server-side if false.
     * @type {boolean}
     * @memberof EventCall
     */
    isServer: boolean;

    /**
     * Used to call an event right when an objective is started.
     * Only useful for the job system.
     * @type {boolean}
     * @memberof EventCall
     */
    callAtStart?: boolean;
}
