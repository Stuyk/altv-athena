export default interface IAction {
    eventName: string;
    args: Array<unknown>;
    isServer: boolean;
}
