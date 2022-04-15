import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

import VehicleFuncs from '../../../../../server/extensions/vehicleFuncs';
export function handleRefillCmd(player: alt.Player) {
    if (!player.vehicle || !player.vehicle.data.fuel) {
        return;
    }

    player.vehicle.data.fuel = 100;
    VehicleFuncs.save(player.vehicle, player.vehicle.data);
    Athena.player.emit.notification(player, `Vehicle refilled.`);
}
