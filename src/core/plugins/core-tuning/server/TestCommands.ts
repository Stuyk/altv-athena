import alt from 'alt-server';
import vehicle from '../../../client/extensions/vehicle';
import { command } from '../../../server/decorators/commands';
import VehicleFuncs from '../../../server/extensions/vehicleFuncs';
import { PERMISSIONS } from '../../../shared/flags/permissionFlags';

class TestCommands {
    @command('sh', 'Sets vehicle handling value', PERMISSIONS.ADMIN)
    private static toggleNeonCommand(player: alt.Player, key: string, value: string): void {
        const vehicle = player.vehicle;
        if (!vehicle?.valid) return;
        if (!vehicle?.data) return;

        if (!vehicle.data.tuning) vehicle.data.tuning = {};
        if (!vehicle.data.tuning.handling) vehicle.data.tuning.handling = {};

        const nValue = parseInt(value) ?? 0;
        vehicle.data.tuning.handling[key] = nValue;
        vehicle.setStreamSyncedMeta('handlingData', vehicle.data.tuning.handling);

        VehicleFuncs.save(vehicle, vehicle.data);
    }

    @command('ft', 'Full tunes a vehicle', PERMISSIONS.ADMIN)
    private static fullTuneVehiclecommand(player: alt.Player): void {
        const vehicle = player.vehicle;
        if (!vehicle?.valid) return;
        if (!vehicle?.data) return;

        if (!vehicle.data.tuning) vehicle.data.tuning = {};
        if (!vehicle.data.tuning.mods) vehicle.data.tuning.mods = [];

        for (let i = 0; i < 70; ++i) {
            const maxId = vehicle.getModsCount(i);

            if (maxId > 0) {
                vehicle.setMod(i, maxId);

                vehicle.data.tuning.mods.push({
                    id: i,
                    value: maxId,
                });
            }
        }

        VehicleFuncs.save(vehicle, vehicle.data);
    }
}
