import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { VehicleEvents } from '../../../../server/events/vehicleEvents';
import { ATHENA_EVENTS_VEHICLE } from '../../../../shared/enums/athenaEvents';

export class GarageSystem {
    static init() {
        VehicleEvents.on(ATHENA_EVENTS_VEHICLE.DESTROYED, GarageSystem.handleDestroy);
    }

    static handleDestroy(vehicle: alt.Vehicle) {
        if (!vehicle || !vehicle.data) {
            return;
        }

        Athena.vehicle.funcs.save(vehicle, { garageIndex: null, position: { x: 0, y: 0, z: 0 } });
    }
}
