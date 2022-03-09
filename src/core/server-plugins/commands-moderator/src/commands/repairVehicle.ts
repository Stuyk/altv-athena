import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
import VehicleFuncs from '../../../../server/extensions/vehicleFuncs';

export function handleRepairVehicleCmd(player: alt.Player) {
    if (!player.vehicle || !player.vehicle.data) {
        return;
    }
    player.vehicle.data.bodyHealth = 1000;
    player.vehicle.data.engineHealth = 1000;
    VehicleFuncs.repair(player.vehicle);
    VehicleFuncs.save(player.vehicle, player.vehicle.data);
    playerFuncs.emit.notification(player, `Vehicle successfully repaired.`);
}
