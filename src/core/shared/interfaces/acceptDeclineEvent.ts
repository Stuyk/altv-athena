export interface AcceptDeclineEvent<T = Object> {
    question: string;
    onClientEvents: {
        accept: string;
        decline: string;
    };
    data?: T;
}
