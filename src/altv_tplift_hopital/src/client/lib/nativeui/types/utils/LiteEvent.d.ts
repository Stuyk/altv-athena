interface ILiteEvent {
    on(handler: {
        (...args: any[]): void;
    }): void;
    off(handler: {
        (...args: any[]): void;
    }): void;
}
export default class LiteEvent implements ILiteEvent {
    private handlers;
    on(handler: {
        (...args: any[]): void;
    }): void;
    off(handler: {
        (...args: any[]): void;
    }): void;
    emit(...args: any[]): void;
    expose(): ILiteEvent;
    count(): number;
}
export {};
