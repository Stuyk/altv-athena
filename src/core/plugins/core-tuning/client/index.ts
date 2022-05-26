import alt from 'alt-client';
import IVehicleHandling from '../../../shared/interfaces/iVehicleHandling';

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
