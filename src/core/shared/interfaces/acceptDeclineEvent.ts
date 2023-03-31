/**
 * Used when prompting the user with an accept / decline event.
 *
 *
 * @interface AcceptDeclineEvent
 * @template T
 */
export interface AcceptDeclineEvent<T = Object> {
    question: string;
    onClientEvents: {
        accept: string;
        decline: string;
    };
    data?: T;
}
