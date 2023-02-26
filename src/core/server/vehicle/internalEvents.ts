import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import * as tempVehicles from './tempVehicles';

import { update } from './controls';
import { SEAT } from './shared';

function enter(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
    if (seat === SEAT.DRIVER) {
        Athena.player.events.trigger('player-entered-vehicle-as-driver', player, vehicle);
    }
}

function entering(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
    //
}

/**
 * Called when a player has left the vehicle.
 *
 * @param {alt.Player} player
 * @param {alt.Vehicle} vehicle
 * @param {number} seat
 * @return {*}
 */
function leave(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
    if (seat === SEAT.DRIVER) {
        update(vehicle);
    }

    Athena.player.events.trigger('player-left-vehicle-seat', player, vehicle, seat);

    // Check for temporary
    if (!tempVehicles.has(vehicle)) {
        return;
    }

    if (seat !== SEAT.DRIVER) {
        return;
    }

    if (!tempVehicles.shouldBeDestroyed(vehicle)) {
        return;
    }

    alt.setTimeout(() => {
        try {
            vehicle.destroy();
        } catch (err) {}
    }, 500);
}

/**
 * Called when a vehicle is destroyed by physial means.
 *
 * @param {alt.Vehicle} vehicle
 */
function destroyed(vehicle: alt.Vehicle) {
    if (!tempVehicles.has(vehicle)) {
        return;
    }

    vehicle.destroy();
}

/**
 * Called when a vehicle is deleted / despawned.
 *
 * @param {alt.Entity} entity
 */
function removeEntity(entity: alt.Entity) {
    if (!(entity instanceof alt.Vehicle)) {
        return;
    }

    const id = entity.id;
    if (tempVehicles.has(id)) {
        tempVehicles.remove(id);
    }
}

alt.on('playerEnteringVehicle', entering);
alt.on('playerEnteredVehicle', enter);
alt.on('playerLeftVehicle', leave);
alt.on('vehicleDestroy', destroyed);
alt.on('removeEntity', removeEntity);
