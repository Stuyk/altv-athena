import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

/**
 * Called when a player has sat down in a seat in a vehicle.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {number} seat
 */
function enter(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
    if (seat === Athena.vehicle.shared.SEAT.DRIVER) {
        Athena.player.events.trigger('player-entered-vehicle-as-driver', player, vehicle);
    }
}

/**
 * Called when a player has opened the door and is sliding into a seat.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {number} seat
 */
function entering(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
    //
}

/**
 * Called when a player has left the vehicle.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {number} seat
 * @return {void}
 */
function leave(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
    if (seat === Athena.vehicle.shared.SEAT.DRIVER) {
        Athena.vehicle.controls.update(vehicle);
    }

    Athena.player.events.trigger('player-left-vehicle-seat', player, vehicle, seat);

    // Check for temporary
    if (!Athena.vehicle.tempVehicles.has(vehicle)) {
        return;
    }

    if (seat !== Athena.vehicle.shared.SEAT.DRIVER) {
        return;
    }

    if (!Athena.vehicle.tempVehicles.shouldBeDestroyed(vehicle)) {
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
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 */
function destroyed(vehicle: alt.Vehicle) {
    if (!Athena.vehicle.tempVehicles.has(vehicle)) {
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
    if (Athena.vehicle.tempVehicles.has(id)) {
        Athena.vehicle.tempVehicles.remove(id);
    }
}

alt.on('playerEnteringVehicle', entering);
alt.on('playerEnteredVehicle', enter);
alt.on('playerLeftVehicle', leave);
alt.on('vehicleDestroy', destroyed);
alt.on('removeEntity', removeEntity);
