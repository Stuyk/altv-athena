import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
import VehicleFuncs from '../../../../server/extensions/vehicleFuncs';
export function handleRefillCmd(player: alt.Player) {
    if (!player.vehicle || !player.vehicle.data.fuel) {
        return;
    }

    player.vehicle.data.fuel = 100;
    VehicleFuncs.save(player.vehicle, player.vehicle.data);
    playerFuncs.emit.notification(player, `Vehicle refilled.`);
}
