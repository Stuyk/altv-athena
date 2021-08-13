import * as alt from 'alt-server';
import * as ref from '../../shared/interfaces/IVehicle';

// This is an example of how to extend the existing vehicle interface.
declare module 'alt-server' {
    export interface IVehicle extends Partial<ref.IVehicle> {
        someData?: string;
        someOtherData?: string;
    }
}

const test = new alt.Vehicle('whatever', 0, 0, 0, 0, 0, 0);

test.data = {};
test.data.someData = 'hi';
