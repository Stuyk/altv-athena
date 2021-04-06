import * as alt from 'alt-server';
import { Vehicle_Behavior, Vehicle_State } from '../../../shared/enums/vehicle';
import { Vehicle } from '../../../shared/interfaces/Vehicle';
import { ATHENA_EVENTS_VEHICLE } from '../../enums/athena';
import { sha256Random } from '../../utility/encryption';
import { playerFuncs } from '../Player';

const ownershipBehavior = Vehicle_Behavior.CONSUMES_FUEL | Vehicle_Behavior.NEED_KEY_TO_START;
const tmpBehavior =
    Vehicle_Behavior.NO_KEY_TO_LOCK |
    Vehicle_Behavior.NO_KEY_TO_START |
    Vehicle_Behavior.UNLIMITED_FUEL |
    Vehicle_Behavior.NO_SAVE;

/**
 * Add a vehicle to a player's data.
 * @param {alt.Player} player
 * @param {Partial<Vehicle>} data
 * @return {*}  {alt.Vehicle}
 */
function add(player: alt.Player, data: Partial<Vehicle>): alt.Vehicle {
    data.uid = sha256Random(JSON.stringify(player.data));

    // Add or append vehicle to player.data
    if (!player.data.vehicles) {
        player.data.vehicles = [data];
    } else {
        player.data.vehicles.push(data);
    }

    playerFuncs.save.field(player, 'vehicles', player.data.vehicles);
    playerFuncs.sync.vehicles(player);
    return spawn(player, data as Vehicle);
}

/**
 * Try to remove vehicle from a player's vehicle list.
 * @param {alt.Player} player
 * @param {string} uid
 * @return {*}  {boolean}
 */
function remove(player: alt.Player, uid: string): boolean {
    if (!player.data.vehicles) {
        return false;
    }

    const index = player.data.vehicles.findIndex((v) => v.uid === uid);
    if (index <= -1) {
        return false;
    }

    player.data.vehicles.splice(index, 1);
    playerFuncs.save.field(player, 'vehicles', player.data.vehicles);
    playerFuncs.sync.vehicles(player);
    return true;
}

/**
 * Despawns a vehicle based on the id given.
 * @param {number} id
 * @return {boolean}  {boolean}
 */
function despawn(id: number, player: alt.Player = null): boolean {
    const vehicle = alt.Vehicle.all.find((v) => v.id === id);
    if (!vehicle) {
        return false;
    }

    if (vehicle.valid && vehicle.destroy) {
        alt.emit(ATHENA_EVENTS_VEHICLE.DESPAWNED, vehicle);
        vehicle.destroy();
    }

    if (player && player.valid) {
        player.lastVehicleID = null;
    }

    return true;
}

/**
 * Creates a temporary vehicle.
 * @param {alt.Player} player
 * @param {string} model
 * @param {alt.IVector3} position
 * @param {alt.IVector3} rotation
 * @return {alt.Vehicle}  {alt.Vehicle}
 */
function tempVehicle(player: alt.Player, model: string, pos: alt.IVector3, rot: alt.IVector3): alt.Vehicle {
    const vehicle = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
    vehicle.player_id = player.id;
    vehicle.behavior = tmpBehavior;
    vehicle.numberPlateText = 'TEMP';
    vehicle.setStreamSyncedMeta(Vehicle_State.OWNER, vehicle.player_id);
    return vehicle;
}

/**
 * Used to spawn a player owned vehicle.
 * @param {alt.Player} player
 * @param {Vehicle} data
 */
function spawn(player: alt.Player, data: Vehicle): alt.Vehicle {
    // Destroy previous vehicle
    if (player.lastVehicleID !== null && player.lastVehicleID !== undefined) {
        const vehicle = alt.Vehicle.all.find((v) => v.id.toString() === player.lastVehicleID.toString());
        if (vehicle && vehicle.valid && vehicle.destroy) {
            try {
                vehicle.destroy();
            } catch (err) {}
        }
    }

    // Create the new vehicle.
    const vehicle = new alt.Vehicle(
        data.model,
        data.position.x,
        data.position.y,
        data.position.z,
        data.rotation.x,
        data.rotation.y,
        data.rotation.z
    );

    player.lastVehicleID = vehicle.id;

    // Setup vehicle data.
    if (data.fuel === null || data.fuel === undefined) {
        data.fuel = 100;
    }

    vehicle.data = data;
    vehicle.fuel = data.fuel;
    vehicle.player_id = player.id;
    vehicle.behavior = ownershipBehavior;

    let color;

    if (!data.color) {
        color = new alt.RGBA(255, 255, 255, 255);
    } else {
        color = new alt.RGBA(data.color.r, data.color.g, data.color.b, 255);
    }

    // Primary
    vehicle.customPrimaryColor = color;

    // Secondary
    vehicle.customSecondaryColor = color;

    // Process mods, plates, etc.
    vehicle.numberPlateText = vehicle.data.uid.substring(0, 8);

    // Synchronize Ownership
    vehicle.setStreamSyncedMeta(Vehicle_State.OWNER, vehicle.player_id);
    alt.emit(ATHENA_EVENTS_VEHICLE.SPAWNED, vehicle);
    return vehicle;
}

export default {
    add,
    despawn,
    remove,
    spawn,
    tempVehicle
};
