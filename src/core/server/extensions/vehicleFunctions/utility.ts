import * as alt from 'alt-server';

import { VEHICLE_EVENTS, Vehicle_Seat_List } from '../../../shared/enums/vehicle';
import { ATHENA_EVENTS_VEHICLE } from '../../enums/athenaEvents';
import Logger from '../../utility/athenaLogger';
import { playerFuncs } from '../Player';

function eject(v: alt.Vehicle, player: alt.Player): void {
    if (!player.vehicle || player.vehicle !== v) {
        return;
    }

    playerFuncs.safe.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
}

function repair(v: alt.Vehicle): void {
    v.repair();
    // setter.doorOpen(v, null, Vehicle_Door_List.HOOD, false, true);
    alt.emit(ATHENA_EVENTS_VEHICLE.REPAIRED, v);
}

function warpInto(v: alt.Vehicle, player: alt.Player, seat: Vehicle_Seat_List): void {
    if (v.driver) {
        return;
    }

    if (v.driver === player) {
        return;
    }

    alt.nextTick(() => {
        if (!player || !player.valid) {
            return;
        }

        alt.emitClient(player, VEHICLE_EVENTS.SET_INTO, v, seat);
    });
}

function despawnAll(id: number) {
    const vehicles = [...alt.Vehicle.all].filter((veh) => veh && veh.valid && veh.player_id === id);
    if (vehicles.length <= 0) {
        return;
    }

    Logger.info(`Player ${id} logged out. Despawning ${vehicles.length} vehicles.`);
    for (let i = 0; i < vehicles.length; i++) {
        try {
            vehicles[i].destroy();
        } catch (err) {
            continue;
        }
    }
}

export default {
    eject,
    repair,
    warpInto,
    despawnAll
};
