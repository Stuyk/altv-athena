import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';
import { VehicleState } from '@AthenaShared/interfaces/vehicleState';
import IVehicleTuning from '@AthenaShared/interfaces/vehicleTuning';

export interface AddOptions {
    /**
     * Vehicle Tuning Interface
     * Such as modkits and the like
     *
     * @type {(Partial<IVehicleTuning> | IVehicleTuning | undefined)}
     * @memberof AddOptions
     */
    tuning?: Partial<IVehicleTuning> | IVehicleTuning | undefined;

    /**
     * Vehicle state
     * such as color, neon, etc.
     *
     * @type {(Partial<VehicleState> | VehicleState)}
     * @memberof AddOptions
     */
    state?: Partial<VehicleState> | VehicleState;
}

/**
 * Add a vehicle to a player.
 * The position specified is where the vehicle can be found.
 *
 * @export
 * @param {alt.Player} player
 * @param {(string | number)} model
 * @param {alt.IVector3} pos
 * @return {Promise<boolean>}
 */
export async function toPlayer(
    player: alt.Player,
    model: string,
    pos: alt.IVector3,
    options: AddOptions = undefined,
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
            keys: [],
            fuel: 100,
            model,
            owner: playerData._id,
            permissions: [],
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

interface VehicleAddFuncs {
    toPlayer: typeof toPlayer;
}

const Overrides: Partial<VehicleAddFuncs> = {};

export function override(functionName: 'toPlayer', callback: typeof toPlayer);
/**
 * Used to override add owned vehicle functionality
 *
 * @export
 * @param {keyof VehicleAddFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof VehicleAddFuncs, callback: any): void {
    Overrides[functionName] = callback;
}