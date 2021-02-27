import * as alt from 'alt-server';
import { Vehicle_Events, Vehicle_Seat_List } from 'core/shared/enums/vehicle';
import { ATHENA_EVENTS_VEHICLE } from '../../enums/athena';
import { playerFuncs } from '../Player';

function eject(v: alt.Vehicle, player: alt.Player): void {
    if (!player.vehicle || player.vehicle !== v) {
        return;
    }

    playerFuncs.safe.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
}

function repair(v: alt.Vehicle): void {
    v.repair();
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

        alt.emitClient(player, Vehicle_Events.SET_INTO, v, seat);
    });
}

export default {
    eject,
    repair,
    warpInto
};
