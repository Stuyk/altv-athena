export default class Scaleform {
    private _handle;
    private scaleForm;
    constructor(scaleForm: string);
    get handle(): number;
    get isValid(): boolean;
    get isLoaded(): boolean;
    private callFunctionHead;
    callFunction(funcName: string, ...args: any[]): void;
    callFunctionReturn(funcName: string, ...args: any[]): number;
    render2D(): void;
    recreate(): void;
    destroy(): void;
}
