import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { ATHENA_EVENTS_VEHICLE } from '../../shared/enums/athenaEvents';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { Vehicle_Behavior, VEHICLE_LOCK_STATE, VEHICLE_STATE } from '../../shared/enums/vehicle';
import { VEHICLE_CLASS } from '../../shared/enums/vehicleTypeFlags';
import { VEHICLE_OWNERSHIP } from '../../shared/flags/vehicleOwnershipFlags';
import { VehicleData } from '../../shared/information/vehicles';
import { Item } from '../../shared/interfaces/item';
import { IVehicle } from '../../shared/interfaces/iVehicle';
import { Vector3 } from '../../shared/interfaces/vector';
import { VehicleInfo } from '../../shared/interfaces/vehicleInfo';
import { isFlagEnabled } from '../../shared/utility/flags';
import { Athena } from '../api/athena';
import { DEFAULT_CONFIG } from '../athena/main';
import { VehicleEvents } from '../events/vehicleEvents';
import { Collections } from '../interface/iDatabaseCollections';
import { sha256Random } from '../utility/encryption';
import { getMissingNumber } from '../utility/math';

const SpawnedVehicles: { [id: string]: alt.Vehicle } = {};
const OWNED_VEHICLE = Vehicle_Behavior.CONSUMES_FUEL | Vehicle_Behavior.NEED_KEY_TO_START;
const TEMPORARY_VEHICLE =
    Vehicle_Behavior.NO_KEY_TO_LOCK |
    Vehicle_Behavior.NO_KEY_TO_START |
    Vehicle_Behavior.UNLIMITED_FUEL |
    Vehicle_Behavior.NO_SAVE;

const SaveInjections: Array<(vehicle: alt.Vehicle) => { [key: string]: any }> = [];

const BeforeCreateInjections: Array<(document: IVehicle) => IVehicle | void> = [];
const BeforeDespawnInjections: Array<(vehicle: alt.Vehicle) => void> = [];

interface VehicleKeyItem extends Item {
    data: {
        vehicle: string;
        key: string;
    };
}

export default class VehicleFuncs {
    /**
     * Lets you create an injection into the default save function.
     *
     * What that means is you can return specific data from a callback as an object.
     *
     * That object will then be appended to the data to save for the vehicle.
     *
     * Example:
     * ```ts
     * function saveEngineStatus(vehicle: alt.Vehicle) {
     *     return { engineStatus: vehicle.engineOn };
     * }
     *
     * VehicleFuncs.addSaveInjection(saveEngineStatus)
     * ```
     * @static
     * @param {(vehicle: alt.Vehicle) => { [key: string]: any }} callback
     * @memberof VehicleFuncs
     */
    static addSaveInjection(callback: (vehicle: alt.Vehicle) => { [key: string]: any }) {
        SaveInjections.push(callback);
    }

    /**
     * Let's you create an injection into the default create function.
     *
     * Useful when you want to perform some action before the vehicle is created.
     * You can technically also modify the document before Athena will make use of them.
     *
     * IMPORTANT: Modified documents may be saved after all callbacks have been executed.
     * Missuse of this feature can cause data loss.
     *
     * Example:
     * ```ts
     * function beforeVehicleCreate(document: IVehicle) {
     *   const blacklistedVehicles = ['rhino', 'hydra'];
     *
     *   if (blacklistedVehicles.includes(document.model)) {
     *       alt.logWarn(`Vehicle model ${document.model} is blacklisted, replacing with faggio`);
     *       document.model = 'faggio';
     *   }
     *
     *   return document;
     * }
     * VehicleFuncs.addBeforeCreateInjection(beforeVehicleCreate);
     * ```
     * @static
     * @param {(document: IVehicle) => void} callback
     * @memberof VehicleFuncs
     */
    static addBeforeCreateInjection(callback: (document: IVehicle) => IVehicle | void) {
        BeforeCreateInjections.push(callback);
    }

    /**
     * Let's you create an injection into the default despawn function.
     *
     * What that means is you can do something when a vehicle is despawned.
     * For example, you can cleanup any data you have stored for the vehicle element.
     *
     * @static
     * @param {(vehicle: alt.Vehicle) => void} callback
     * @memberof VehicleFuncs
     */
    static addBeforeDespawnInjection(callback: (vehicle: alt.Vehicle) => void) {
        BeforeDespawnInjections.push(callback);
    }

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
        return Database.fetchAllByField('owner', _id, Collections.Vehicles);
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

        for (const vehicle of vehicles) {
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

        for (const callback of BeforeCreateInjections) {
            const result = callback(document);

            if (result) {
                document = result;
            }
        }

        // Create the new vehicle.
        const vehicle = new alt.Vehicle(
            document.model,
            document.position.x,
            document.position.y,
            document.position.z,
            document.rotation.x,
            document.rotation.y,
            document.rotation.z,
        );

        vehicle.modelName = document.model;
        SpawnedVehicles[document.id] = vehicle;

        // Setup Default Values
        vehicle.passengers = [];
        vehicle.customPrimaryColor = new alt.RGBA(255, 255, 255, 255);
        vehicle.customSecondaryColor = new alt.RGBA(255, 255, 255, 255);
        vehicle.setStreamSyncedMeta(VEHICLE_STATE.LOCKSYMBOL, DEFAULT_CONFIG.VEHICLE_DISPLAY_LOCK_STATUS);
        vehicle.setStreamSyncedMeta(
            VEHICLE_STATE.LOCK_INTERACTION_INFO,
            DEFAULT_CONFIG.VEHICLE_DISPLAY_LOCK_INTERACTION_INFO,
        );

        // Setup Default Document Values
        if (document.fuel === null || document.fuel === undefined) {
            document.fuel = 100;
        }

        vehicle.data = document;
        vehicle.passengers = [];
        vehicle.behavior = vehicle.data.behavior;

        // Check if the vehicle is of the bike type
        // Force it to use unlimited fuel.
        const vehicleInfo = VehicleData.find((x) => x.name === vehicle.data.model);
        if (vehicleInfo && vehicleInfo.class === VEHICLE_CLASS.CYCLE) {
            if (!isFlagEnabled(vehicle.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
                vehicle.data.behavior = vehicle.data.behavior | Vehicle_Behavior.UNLIMITED_FUEL;
                vehicle.behavior = Vehicle_Behavior.UNLIMITED_FUEL;
            }
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

        // Synchronize Ownership
        //vehicle.setStreamSyncedMeta(VEHICLE_STATE.OWNER, vehicle.player_id);
        VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.SPAWNED, vehicle);
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

        for (const callback of BeforeDespawnInjections) {
            callback(SpawnedVehicles[id]);
        }

        // Remove all information from passengers regarding this vehicle.
        for (let i = 0; i < SpawnedVehicles[id].passengers.length; i++) {
            const passenger = SpawnedVehicles[id].passengers[i];
            if (!passenger.player || !passenger.player.valid) {
                continue;
            }

            passenger.player.lastEnteredVehicleID = null;
        }

        VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.DESPAWNED, SpawnedVehicles[id]);
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
        doNotDelete: boolean = false,
    ): alt.Vehicle {
        const vehicle = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
        vehicle.player_id = player.id;
        vehicle.behavior = TEMPORARY_VEHICLE;
        vehicle.numberPlateText = 'TEMP';
        vehicle.lockState = VEHICLE_LOCK_STATE.LOCKED;
        vehicle.isTemporary = true;
        vehicle.modelName = model;

        if (doNotDelete) {
            vehicle.overrideTemporaryDeletion = true;
        }

        vehicle.setStreamSyncedMeta(VEHICLE_STATE.OWNER, vehicle.player_id);
        vehicle.setStreamSyncedMeta(VEHICLE_STATE.LOCKSYMBOL, DEFAULT_CONFIG.VEHICLE_DISPLAY_LOCK_STATUS);
        vehicle.setStreamSyncedMeta(
            VEHICLE_STATE.LOCK_INTERACTION_INFO,
            DEFAULT_CONFIG.VEHICLE_DISPLAY_LOCK_INTERACTION_INFO,
        );
        return vehicle;
    }

    /**
     * Update portions of data for a vehicle.
     * @param {alt.Vehicle} p
     * @param {Partial<Character>} dataObject
     * @return {Promise<boolean>}
     */
    static async save(vehicle: alt.Vehicle, dataObject: Partial<IVehicle>): Promise<boolean> {
        if (!vehicle.valid) {
            return false;
        }

        if (!vehicle.data) {
            return false;
        }

        // Prevent Saving
        if (isFlagEnabled(vehicle.data.behavior, Vehicle_Behavior.NO_SAVE)) {
            return false;
        }

        let injections = { ...dataObject };
        for (let i = 0; i < SaveInjections.length; i++) {
            try {
                injections = { ...injections, ...SaveInjections[i](vehicle) };
            } catch (err) {
                console.warn(`Got Save Injection Error for Vehicle: ${err}`);
                continue;
            }
        }

        return await Database.updatePartialData(vehicle.data._id.toString(), { ...injections }, Collections.Vehicles);
    }

    /**
     * Repairs a vehicle if it is not blown up.
     * @static
     * @param {alt.Vehicle} vehicle
     * @memberof VehicleFuncs
     */
    static repair(vehicle: alt.Vehicle) {
        vehicle.repair();
        VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.REPAIRED, vehicle);
        VehicleFuncs.update(vehicle);
    }

    /**
     * Check if a player has keys or ownership of this vehicle.
     * If the vehicle has no 'data' it automatically return true.
     * @static
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @param {boolean} skipKeys Should we check for keys (other players)?
     * @return {boolean}
     * @memberof VehicleFuncs
     */
    static hasOwnership(player: alt.Player, vehicle: alt.Vehicle): boolean {
        const isNotLockable = isFlagEnabled(vehicle.behavior, Vehicle_Behavior.NO_KEY_TO_LOCK);
        const needsNoKeys = isFlagEnabled(vehicle.behavior, Vehicle_Behavior.NO_KEY_TO_START);

        if (vehicle.player_id === player.id) {
            return true;
        }

        if (isNotLockable && needsNoKeys) {
            return true;
        }

        if (!vehicle.data) {
            return true;
        }

        // Check Faction Ownership
        if (vehicle.data.ownerType === VEHICLE_OWNERSHIP.FACTION && vehicle.data.owner === player.data.faction) {
            return true;
        }

        // Check Actual Ownership
        if (vehicle.data.owner === player.data._id.toString()) {
            return true;
        }

        // Check for Physical Key
        for (let i = 0; i < player.data.inventory.length; i++) {
            const item = player.data.inventory[i];
            if (!item) {
                continue;
            }

            if (!item.data) {
                continue;
            }

            if (!item.data.vehicle && !item.data.key) {
                continue;
            }

            if (item.data.vehicle.toString() !== vehicle.data._id.toString()) {
                continue;
            }

            if (item.data.key !== vehicle.data.key) {
                continue;
            }

            return true;
        }

        return false;
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
            lastUsed: Date.now(), // ms
        });
    }

    /**
     * Despawn all vehicles that are associated with an id.
     * @static
     * @param {string} id Player ID
     * @return {*}
     * @memberof VehicleFuncs
     */
    static async despawnAll(id: string) {
        const vehicles = [...alt.Vehicle.all].filter((veh) => veh && veh.valid && `${veh.data.owner}` === `${id}`);

        if (vehicles.length <= 0) {
            return;
        }

        for (const vehicle of vehicles) {
            try {
                await VehicleFuncs.despawn(vehicle.data.id);
            } catch {}
        }
    }

    /**
     * Returns stored information about the vehicle.
     * However, does not work with new alt.Vehicle vehicle(s).
     * @static
     * @param {alt.Vehicle} vehicle
     * @return {VehicleInfo}
     * @memberof VehicleFuncs
     */
    static getInfo(vehicle: alt.Vehicle): VehicleInfo {
        if (!vehicle || !vehicle.valid) {
            return null;
        }

        if (!vehicle.modelName) {
            return null;
        }

        return VehicleData.find((info) => info.name === vehicle.modelName);
    }

    /**
     * Create a physical key for the vehicle and gives it to the specified player.
     *
     * Allows players to spawn this vehicle regardless of ownership.
     * Physical key can be wiped by having vehicle owner wipe keys.
     *
     * @static
     * @param {alt.Vehicle} vehicle
     * @return {Item}
     * @memberof VehicleFuncs
     */
    static async createKey(
        player: alt.Player,
        vehicle: alt.Vehicle | IVehicle,
        doNotAddToInventory: boolean = false,
    ): Promise<VehicleKeyItem | null> {
        // Get vehicle data specifically
        if (vehicle instanceof alt.Vehicle) {
            if (!vehicle || !vehicle.valid || !vehicle.data) {
                return null;
            }

            vehicle = vehicle.data;
        }

        // Verify data is valid
        if (!vehicle._id) {
            return null;
        }

        if (!vehicle.key) {
            vehicle.key = sha256Random(JSON.stringify(vehicle));
            await Database.updatePartialData(vehicle._id.toString(), { key: vehicle.key }, Collections.Vehicles);
        }

        const item: VehicleKeyItem = {
            name: `Key for ${vehicle.model}`,
            description: `A key for the vehicle model ${vehicle.model}`,
            behavior: ITEM_TYPE.DESTROY_ON_DROP,
            quantity: 1,
            icon: 'key',
            data: {
                vehicle: vehicle._id.toString(),
                key: vehicle.key,
            },
        };

        if (!doNotAddToInventory) {
            const inventory = Athena.player.inventory.getFreeInventorySlot(player);
            if (!inventory) {
                Athena.player.emit.notification(player, 'No room in inventory.');
                return null;
            }

            if (!Athena.player.inventory.inventoryAdd(player, item, inventory.slot)) {
                Athena.player.emit.notification(player, 'No room in inventory.');
                return null;
            }

            Athena.player.save.field(player, 'inventory', player.data.inventory);
            Athena.player.sync.inventory(player);
        }

        return item;
    }

    /**
     * Return a list of physical keys a player has.
     * @static
     * @param {alt.Player} player
     * @return {Array<VehicleKeyItem>}
     * @memberof VehicleFuncs
     */
    static getAllVehicleKeys(player: alt.Player): Array<VehicleKeyItem> {
        if (!player || !player.valid) {
            return [];
        }

        const keys = player.data.inventory.filter((item) => {
            if (!item) {
                return false;
            }

            if (!item.data) {
                return false;
            }

            if (!item.data.vehicle) {
                return false;
            }

            if (!item.data.key) {
                return false;
            }

            return true;
        });

        return keys as Array<VehicleKeyItem>;
    }

    /**
     * Get a list of vehicles that can be spawned by vehicle key items.
     * @static
     * @param {Array<VehicleKeyItem>} keys
     * @memberof VehicleFuncs
     */
    static async getValidVehicleIDsFromKeys(keys: Array<VehicleKeyItem>): Promise<Array<IVehicle>> {
        const validVehicles: Array<IVehicle> = [];

        for (let i = 0; i < keys.length; i++) {
            const document = await Database.fetchData<IVehicle>('key', keys[i].data.key, Collections.Vehicles);
            if (!document) {
                continue;
            }

            validVehicles.push(document);
        }

        return validVehicles;
    }
}
