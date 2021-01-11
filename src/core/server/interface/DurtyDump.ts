import * as alt from 'alt-server';

export interface DurtyDumpInterface {
    Name: string;
    Hash: number;
    Position: {
        X: number;
        Y: number;
        Z: number;
    };
    Rotation: {
        X: number;
        Y: number;
        Z: number;
    };
}
