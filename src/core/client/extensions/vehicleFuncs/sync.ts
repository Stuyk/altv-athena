import * as alt from 'alt-client';
import * as native from 'natives';
import { VEHICLE_DOOR_STATE } from '../../../shared/enums/vehicle';
import IVehicleHandling from '../../../shared/interfaces/iVehicleHandling';

function update(vehicle: alt.Vehicle): void {
    // Synchronize Doors
    Object.keys(VEHICLE_DOOR_STATE).forEach((key, index) => {
        const value = vehicle.getStreamSyncedMeta(VEHICLE_DOOR_STATE[key]);
        if (value === null || value === undefined || value === false) {
            native.setVehicleDoorShut(vehicle.scriptID, index, true);
        } else {
            native.setVehicleDoorOpen(vehicle.scriptID, index, false, true);
        }
    });
}

alt.on('streamSyncedMetaChange', (entity: alt.Entity, key: string, value: any) => {
    if (!(entity instanceof alt.Vehicle)) return;
    if (key !== 'handlingData') return;

    const vehicle: alt.Vehicle = entity;
    const handlingData: Partial<IVehicleHandling> = value;

    vehicle.handling.reset();

    for (const [key, val] of Object.entries(handlingData)) {
        vehicle.handling[key] = val;
    }
});

export default {
    update,
};
