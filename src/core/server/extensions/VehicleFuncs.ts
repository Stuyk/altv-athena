import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';

import { ATHENA_EVENTS_VEHICLE } from '../../shared/enums/athenaEvents';
import { Vehicle_Behavior, VEHICLE_LOCK_STATE, VEHICLE_STATE } from '../../shared/enums/vehicle';
import { IVehicle } from '../../shared/interfaces/IVehicle';
import { Vector3 } from '../../shared/interfaces/Vector';
import { isFlagEnabled } from '../../shared/utility/flags';
import { DEFAULT_CONFIG } from '../athena/main';
import { Collections } from '../interface/DatabaseCollections';
import { sha256Random } from '../utility/encryption';
import { getMissingNumber } from '../utility/math';

const SpawnedVehicles: { [id: string]: alt.Vehicle } = {};
const OWNED_VEHICLE = Vehicle_Behavior.CONSUMES_FUEL | Vehicle_Behavior.NEED_KEY_TO_START;
const TEMPORARY_VEHICLE =
    Vehicle_Behavior.NO_KEY_TO_LOCK |
    Vehicle_Behavior.NO_KEY_TO_START |
    Vehicle_Behavior.UNLIMITED_FUEL |
    Vehicle_Behavior.NO_SAVE;

export default class VehicleFuncs {
    /**
     * Gets the next available ID in the database for the vehicle.
     * @static
     * @return {*}  {Promise<number>}
     * @memberof VehicleFuncs
     */
    static async getNextID(): Promise<number> {
        const vehicles = await Database.fetchAllData<IVehicle>(Collections.Vehicles);

        if (vehicles.length <= 0) {
            return 0;
        }

        const values = vehicles.map((veh) => {
            return veh.id;
        });

        // Indexing needs to start at zero.
        // Does not correlate with dimension.
        return getMissingNumber(values, 0);
    }

    /**
     * Returns a vehicle if it is currently spawned in the world.
     * @static
     * @param {number} id
     * @return {*}  {(alt.Vehicle | null)}
     * @memberof VehicleFuncs
     */
    static getSpawnedVehicle(id: number): alt.Vehicle | null {
        return SpawnedVehicles[id];
    }

    /**
     * Get all player vehicles from the database.
     * @static
     * @param {string} _id
     * @return {*}  {Promise<alt.Vehicle[]>}
     * @memberof VehicleFuncs
     */
    static async getPlayerVehicles(_id: string): Promise<IVehicle[]> {
        return await Database.fetchAllByField('owner', _id, Collections.Vehicles);
    }

    /**
     * Spawn all vehicles based on vehicle data.
     * @static
     * @param {Array<alt.Vehicle>} vehicles
     * @return {*}
     * @memberof VehicleFuncs
     */
    static async spawnPlayerVehicles(vehicles: Array<IVehicle>) {
        if (vehicles.length <= 0) {
            return;
        }

        for (let i = 0; i < vehicles.length; i++) {
            const vehicle = vehicles[i];

            // Skip vehicles without a garage index.
            const hasGarageIndex = vehicle.garageIndex !== undefined && vehicle.garageIndex !== null;
            if (hasGarageIndex && vehicle.garageIndex >= 0) {
                continue;
            }

            // Skip New Vehicles
            if (vehicle.position.x === 0 && vehicle.position.y === 0 && vehicle.position.z === 0) {
                continue;
            }

            VehicleFuncs.spawn(vehicle);
        }
    }

    /**
     * Add a vehicle to the 'vehicles' collection in the database.
     * Associates the vehicle with a player identiier or faction.
     * @static
     * @param {IVehicle} vehicleData
     * @param {boolean} doNotSpawn
     * @memberof VehicleFuncs
     */
    static async add(vehicleData: IVehicle, doNotSpawn = true): Promise<IVehicle> {
        vehicleData.id = await VehicleFuncs.getNextID();
        vehicleData.plate = sha256Random(JSON.stringify(vehicleData)).slice(0, 8);
        vehicleData.behavior = OWNED_VEHICLE;
        vehicleData.fuel = 100;
        const document = await Database.insertData<IVehicle>(vehicleData, Collections.Vehicles, true);
        document._id = document._id.toString();

        if (doNotSpawn) {
            return document;
        }

        VehicleFuncs.spawn(document);
        return document;
    }

    /**
     * Removes a vehicle from the database.
     * Will return true if vehicle was found and removed.
     * False if it was not found.
     * @static
     * @param {number} id
     * @return {*}  {Promise<boolean>}
     * @memberof VehicleFuncs
     */
    static async remove(id: number): Promise<boolean> {
        const vehicles = await Database.fetchAllByField<IVehicle>('id', id, Collections.Vehicles);
        if (!vehicles || vehicles.length <= 0) {
            return false;
        }

        return Database.deleteById(vehicles[0]._id, Collections.Vehicles);
    }

    /**
     * Updates the fuel for this vehicle.
     * @static
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleFuncs
     */
    static async updateFuel(vehicle: alt.Vehicle) {
        // No data present on vehicle. Don't worry about it.
        if (!vehicle?.data?.behavior) {
            return;
        }

        // Has unlimited fuel. Always set to 100.
        if (isFlagEnabled(vehicle.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
            vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, 100);
            return;
        }

        if (vehicle.data.fuel === undefined || vehicle.data.fuel === null) {
            vehicle.data.fuel = 100;
        }

        if (!vehicle.engineOn) {
            vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, vehicle.data.fuel);
            return;
        }

        vehicle.data.fuel = vehicle.data.fuel - DEFAULT_CONFIG.FUEL_LOSS_PER_PLAYER_TICK;

        if (vehicle.data.fuel < 0) {
            vehicle.data.fuel = 0;

            if (vehicle.engineOn) {
                vehicle.engineOn = false;
            }
        }

        vehicle.setSyncedMeta(VEHICLE_STATE.FUEL, vehicle.data.fuel);
        vehicle.setSyncedMeta(VEHICLE_STATE.POSITION, vehicle.pos);

        if (!vehicle.nextSave || Date.now() > vehicle.nextSave) {
            VehicleFuncs.save(vehicle, { fuel: vehicle.data.fuel });
            vehicle.nextSave = Date.now() + 15000;
        }
    }

    /**
     * Spawn a vehicle based on the IVehicle interface.
     * @static
     * @param {IVehicle} document
     * @param {Vector3} [pos=null] Used to override spawn location.
     * @param {Vector3} [rot=null] Used to override spawn rotation.
     * @memberof VehicleFuncs
     */
    static spawn(document: IVehicle, pos: Vector3 = null, rot: Vector3 = null): alt.Vehicle | null {
        if (SpawnedVehicles[document._id.toString()]) {
            return null;
        }

        if (pos && rot) {
            document.position = pos;
            document.rotation = rot;
        }

        // Create the new vehicle.
        const vehicle = new alt.Vehicle(
            document.model,
            document.position.x,
            document.position.y,
            document.position.z,
            document.rotation.x,
            document.rotation.y,
            document.rotation.z
        );

        SpawnedVehicles[document.id] = vehicle;

        // Setup Default Values
        vehicle.passengers = [];
        vehicle.customPrimaryColor = new alt.RGBA(255, 255, 255, 255);
        vehicle.customSecondaryColor = new alt.RGBA(255, 255, 255, 255);

        // Setup Default Document Values
        if (document.fuel === null || document.fuel === undefined) {
            document.fuel = 100;
        }

        vehicle.data = document;
        vehicle.passengers = [];
        vehicle.behavior = vehicle.data.behavior;

        if (vehicle.data.color) {
            vehicle.customPrimaryColor = document.color;
            vehicle.customSecondaryColor = document.color;
        }

        if (vehicle.data.bodyHealth) {
            vehicle.bodyHealth = vehicle.data.bodyHealth;
        }

        if (vehicle.data.engineHealth) {
            vehicle.engineHealth = vehicle.data.engineHealth;
        }

        vehicle.numberPlateText = document.plate;
        vehicle.manualEngineControl = true;
        vehicle.lockState = VEHICLE_LOCK_STATE.LOCKED;

        // Synchronization
        if (pos && rot) {
            VehicleFuncs.save(vehicle, { garageIndex: null, position: pos, rotation: rot });
        } else {
            VehicleFuncs.save(vehicle, { garageIndex: null });
        }

        VehicleFuncs.updateFuel(vehicle);

        // Synchronize Ownership
        //vehicle.setStreamSyncedMeta(VEHICLE_STATE.OWNER, vehicle.player_id);
        alt.emit(ATHENA_EVENTS_VEHICLE.SPAWNED, vehicle);
        return vehicle;
    }

    /**
     * Despawn a vehicle based on its database identifier.
     * Saves last position, rotation, and fuel before despawn.
     * @static
     * @param {number} id Vehicle Data ID
     * @memberof VehicleFuncs
     */
    static async despawn(id: number): Promise<boolean> {
        if (!SpawnedVehicles[id]) {
            return false;
        }

        if (!SpawnedVehicles[id].valid) {
            delete SpawnedVehicles[id];
            return false;
        }

        // Remove all information from passengers regarding this vehicle.
        for (let i = 0; i < SpawnedVehicles[id].passengers.length; i++) {
            const passenger = SpawnedVehicles[id].passengers[i];
            if (!passenger.player || !passenger.player.valid) {
                continue;
            }

            passenger.player.lastEnteredVehicleID = null;
        }

        alt.emit(ATHENA_EVENTS_VEHICLE.DESPAWNED, SpawnedVehicles[id]);
        SpawnedVehicles[id].destroy();
        delete SpawnedVehicles[id];
        return true;
    }

    /**
     * Create a temporary vehicle that is despawned when the player exits the vehicle.
     * @static
     * @param {alt.Player} player
     * @param {string} model
     * @param {alt.IVector3} pos
     * @param {alt.IVector3} rot
     * @return {alt.Vehicle}
     * @memberof VehicleFuncs
     */
    static tempVehicle(
        player: alt.Player,
        model: string,
        pos: alt.IVector3,
        rot: alt.IVector3,
        doNotDelete: boolean = false
    ): alt.Vehicle {
        const vehicle = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
        vehicle.player_id = player.id;
        vehicle.behavior = TEMPORARY_VEHICLE;
        vehicle.numberPlateText = 'TEMP';
        vehicle.lockState = VEHICLE_LOCK_STATE.LOCKED;
        vehicle.isTemporary = true;

        if (doNotDelete) {
            vehicle.overrideTemporaryDeletion = true;
        }

        vehicle.setStreamSyncedMeta(VEHICLE_STATE.OWNER, vehicle.player_id);
        return vehicle;
    }

    /**
     * Update portions of data for a vehicle.
     * @param {alt.Vehicle} p
     * @param {Partial<Character>} dataObject
     * @return {Promise<boolean>}
     */
    static async save(vehicle: alt.Vehicle, dataObject: Partial<IVehicle>): Promise<boolean> {
        if (!vehicle.data) {
            return false;
        }

        // Prevent Saving
        if (isFlagEnabled(vehicle.data.behavior, Vehicle_Behavior.NO_SAVE)) {
            return false;
        }

        return await Database.updatePartialData(vehicle.data._id.toString(), { ...dataObject }, Collections.Vehicles);
    }

    /**
     * Repairs a vehicle if it is not blown up.
     * @static
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleFuncs
     */
    static repair(vehicle: alt.Vehicle) {
        vehicle.repair();
        alt.emit(ATHENA_EVENTS_VEHICLE.REPAIRED, vehicle);
        VehicleFuncs.update(vehicle);
    }

    /**
     * Check if a player has keys or ownership of this vehicle
     * @static
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @param {boolean} skipKeys Should we check for keys (other players)?
     * @return {*}  {boolean}
     * @memberof VehicleFuncs
     */
    static hasOwnership(player: alt.Player, vehicle: alt.Vehicle, skipKeys = false): boolean {
        const isNotLockable = isFlagEnabled(vehicle.behavior, Vehicle_Behavior.NO_KEY_TO_LOCK);
        const needsNoKeys = isFlagEnabled(vehicle.behavior, Vehicle_Behavior.NO_KEY_TO_START);

        if (isNotLockable && needsNoKeys) {
            return true;
        }

        // Used to skip keys for a vehicle.
        // Used for checking ownership while ignoring keys.
        if (!skipKeys) {
            if (vehicle.keys && vehicle.keys.includes(player.data._id.toString())) {
                return true;
            }
        }

        if (vehicle.data.owner === player.data._id.toString()) {
            return true;
        }

        return false;
    }

    /**
     * Check if a vehicle has fuel.
     * @static
     * @param {alt.Vehicle} vehicle
     * @return {*}
     * @memberof VehicleFuncs
     */
    static hasFuel(vehicle: alt.Vehicle) {
        if (isFlagEnabled(vehicle.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
            return true;
        }

        if (!vehicle.data) {
            return true;
        }

        if (vehicle.data.fuel === undefined || vehicle.data.fuel === null) {
            vehicle.data.fuel = 100;
            return true;
        }

        if (vehicle.data.fuel <= 0) {
            return false;
        }

        return true;
    }

    /**
     * Has a vehicle been spawned.
     * @static
     * @param {number} id
     * @return {*}  {boolean}
     * @memberof VehicleFuncs
     */
    static hasBeenSpawned(id: number | string): boolean {
        if (SpawnedVehicles[`${id.toString()}`] && SpawnedVehicles[`${id.toString()}`].valid) {
            return true;
        }

        return false;
    }

    /**
     * Used to update vehicle position, rotation, fuel, and health.
     * @static
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleFuncs
     */
    static update(vehicle: alt.Vehicle) {
        if (!vehicle.data || vehicle.data._id === null || vehicle.data._id === undefined) {
            return;
        }

        // Prevent Saving
        if (isFlagEnabled(vehicle.data.behavior, Vehicle_Behavior.NO_SAVE)) {
            return;
        }

        VehicleFuncs.save(vehicle, {
            position: vehicle.pos,
            rotation: vehicle.rot,
            fuel: vehicle.data.fuel,
            engineHealth: vehicle.engineHealth,
            bodyHealth: vehicle.bodyHealth,
            lastUsed: Date.now() // ms
        });
    }

    /**
     * Despawn all vehicles that are associated with an id.
     * @static
     * @param {string} id Player ID
     * @return {*}
     * @memberof VehicleFuncs
     */
    static despawnAll(id: string) {
        const vehicles = [...alt.Vehicle.all].filter((veh) => veh && veh.valid && `${veh.data.owner}` === `${id}`);

        if (vehicles.length <= 0) {
            return;
        }

        for (let i = 0; i < vehicles.length; i++) {
            try {
                VehicleFuncs.despawn(vehicles[i].data.id);
            } catch (err) {
                continue;
            }
        }
    }
}
