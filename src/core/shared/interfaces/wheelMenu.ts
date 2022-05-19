export interface IWheelOption {
    name: string;
    uid: string;
    color?: string;
    icon?: string;
}

export interface IWheelOptionExt extends IWheelOption {
    callback?: (...args: any[]) => void;
    emitServer?: string;
    emitClient?: string;
    data?: Array<any>;
}
