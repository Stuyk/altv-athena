import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import Database from '@stuyk/ezmongodb';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned.js';
import { VehicleState } from '@AthenaShared/interfaces/vehicleState.js';
import IVehicleTuning from '@AthenaShared/interfaces/vehicleTuning.js';

export interface AddOptions {
    /**
     * Vehicle Tuning Interface
     * Such as modkits and the like
     *
     * @type {(Partial<IVehicleTuning> | IVehicleTuning | undefined)}
     *
     */
    tuning?: Partial<IVehicleTuning> | IVehicleTuning | undefined;

    /**
     * Vehicle state
     * such as color, neon, etc.
     *
     * @type {(Partial<VehicleState> | VehicleState)}
     *
     */
    state?: Partial<VehicleState> | VehicleState;

    /**
     * An array of character ids to add to the vehicle.
     *
     * If doing a large group, consider permissions instead.
     *
     * @type {Array<string>}
     *
     */
    keys?: Array<string>;

    /**
     * Permissions to append
     *
     * @type {Array<string>}
     *
     */
    permissions?: Array<string>;

    /**
     * Should this vehicle always persist on the server and never be allowed to despawn?
     *
     * @type {boolean}
     *
     */
    doNotDespawn?: boolean;
}

/**
 * Add a vehicle to a player.
 * The position specified is where the vehicle can be found.
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(string | number)} model
 * @param {alt.IVector3} pos A position in the world.
 * @return {Promise<boolean>}
 */
export async function toPlayer(
    player: alt.Player,
    model: string,
    pos: alt.IVector3,
    options: Omit<AddOptions, 'doNotDespawn'> = undefined,
): Promise<boolean> {
    if (Overrides.toPlayer) {
        return Overrides.toPlayer(player, model, pos, options);
    }

    const playerData = Athena.document.character.get(player);
    if (typeof playerData === 'undefined') {
        return false;
    }

    try {
        const veh = new alt.Vehicle(model, pos.x, pos.y, pos.z, 0, 0, 0);

        await Athena.systems.global.increase('vehicleId');
        const id = await Athena.systems.global.getKey<number>('vehicleId');

        const ownedVehicle: OwnedVehicle = {
            dimension: 0,
            keys: options && options.keys ? options.keys : [],
            fuel: 100,
            model,
            owner: playerData._id,
            permissions: options && options.permissions ? options.permissions : [],
            plate: Athena.utility.uid.generate().slice(0, 8),
            pos,
            rot: { x: 0, y: 0, z: 0 },
            id,
        };

        if (typeof options !== 'undefined') {
            if (options.state) {
                ownedVehicle.state = options.state;
            }

            if (options.tuning) {
                ownedVehicle.tuning = options.tuning;
            }
        }

        const document = await Database.insertData<OwnedVehicle>(
            ownedVehicle,
            Athena.database.collections.Vehicles,
            true,
        );

        veh.destroy();
        Athena.vehicle.spawn.persistent(document);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * Add a vehicle to the database.
 *
 * Owner can be an identifier, group, etc.
 *
 *
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {(string | number)} model
 * @param {alt.IVector3} pos A position in the world.
 * @return {Promise<boolean>}
 */
export async function toDatabase(
    owner: string,
    model: string,
    pos: alt.IVector3,
    options: AddOptions = undefined,
): Promise<boolean> {
    if (Overrides.toDatabase) {
        return Overrides.toDatabase(owner, model, pos, options);
    }

    try {
        const veh = new alt.Vehicle(model, pos.x, pos.y, pos.z, 0, 0, 0);

        await Athena.systems.global.increase('vehicleId');
        const id = await Athena.systems.global.getKey<number>('vehicleId');

        const ownedVehicle: OwnedVehicle = {
            dimension: 0,
            keys: options && options.keys ? options.keys : [],
            fuel: 100,
            model,
            owner,
            permissions: options && options.permissions ? options.permissions : [],
            plate: Athena.utility.uid.generate().slice(0, 8),
            pos,
            rot: { x: 0, y: 0, z: 0 },
            id,
            doNotDespawn: options && options.doNotDespawn ? options.doNotDespawn : false,
        };

        if (typeof options !== 'undefined') {
            if (options.state) {
                ownedVehicle.state = options.state;
            }

            if (options.tuning) {
                ownedVehicle.tuning = options.tuning;
            }
        }

        const document = await Database.insertData<OwnedVehicle>(
            ownedVehicle,
            Athena.database.collections.Vehicles,
            true,
        );

        veh.destroy();
        Athena.vehicle.spawn.persistent(document);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

interface VehicleAddFuncs {
    toDatabase: typeof toDatabase;
    toPlayer: typeof toPlayer;
}

const Overrides: Partial<VehicleAddFuncs> = {};

export function override(functionName: 'toDatabase', callback: typeof toDatabase);
export function override(functionName: 'toPlayer', callback: typeof toPlayer);
/**
 * Used to override add owned vehicle functionality
 *
 *
 * @param {keyof VehicleAddFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleAddFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
