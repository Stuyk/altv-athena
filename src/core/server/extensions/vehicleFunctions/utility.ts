import * as alt from 'alt-server';
import { Vehicle_Events, Vehicle_Lock_States, Vehicle_Seat_List } from '../../../shared/enums/vehicle';
import { playerFuncs } from '../Player';
import setter from './setter';

function eject(v: alt.Vehicle, player: alt.Player): void {
    if (!player.vehicle || player.vehicle !== v) {
        return;
    }

    playerFuncs.safe.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
}

function repair(v: alt.Vehicle): alt.Vehicle {
    const model = v.model;
    const pos = { ...v.pos };
    const rot = { ...v.rot };
    const owner = v.owner;

    // Destroy the old vehicle.
    try {
        v.destroy();
    } catch (err) {}

    // Respawn the vehicle in the same position.
    const newVehicle: alt.Vehicle = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
    setter.owner(newVehicle, owner);
    return newVehicle;
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
