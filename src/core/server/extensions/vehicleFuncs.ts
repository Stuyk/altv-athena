import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { ATHENA_EVENTS_VEHICLE } from '../../shared/enums/athenaEvents';
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { Vehicle_Behavior, VEHICLE_LOCK_STATE, VEHICLE_STATE } from '../../shared/enums/vehicle';
import { VEHICLE_SYNCED_META } from '../../shared/enums/vehicleSyncedMeta';
import { VEHICLE_CLASS } from '../../shared/enums/vehicleTypeFlags';
import { VehicleData } from '../../shared/information/vehicles';
import { Item } from '../../shared/interfaces/item';
import { IVehicle } from '../../shared/interfaces/iVehicle';
import IVehicleDamage from '../../shared/interfaces/iVehicleDamage';
import IVehicleHandling from '../../shared/interfaces/iVehicleHandling';
import { Vector3 } from '../../shared/interfaces/vector';
import { VehicleInfo } from '../../shared/interfaces/vehicleInfo';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { isFlagEnabled } from '../../shared/utility/flags';
import { Athena } from '../api/athena';
import { DEFAULT_CONFIG } from '../athena/main';
import { VehicleEvents } from '../events/vehicleEvents';
import { Collections } from '../interface/iDatabaseCollections';
import { Injections } from '../systems/injections';
import {
    VehicleDespawnCallback,
    VehicleInjectionNames,
    VehicleOwnershipCallback,
    VehicleSpawnCallback,
} from '../systems/injections/vehicles';
import { sha256Random } from '../utility/encryption';
import { getMissingNumber } from '../utility/math';

const SpawnedVehicles: { [id: string]: alt.Vehicle } = {};
const OWNED_VEHICLE = Vehicle_Behavior.CONSUMES_FUEL | Vehicle_Behavior.NEED_KEY_TO_START;
const DEFAULT_VEHICLE_COLOR = new alt.RGBA(255, 255, 255);
const TEMPORARY_VEHICLE =
    Vehicle_Behavior.NO_KEY_TO_LOCK |
    Vehicle_Behavior.NO_KEY_TO_START |
    Vehicle_Behavior.UNLIMITED_FUEL |
    Vehicle_Behavior.NO_SAVE;

interface VehicleKeyItem extends Item {
    data: {
        vehicle: string;
        key: string;
    };
}

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

            // Skip already existing vehicles.
            const existingVehicle = alt.Vehicle.all.find(
                (veh) => veh && veh.valid && veh.data && veh.data._id.toString() === vehicle._id.toString(),
            );

            if (existingVehicle) {
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
        vehicleData.plate ??= sha256Random(JSON.stringify(vehicleData)).slice(0, 8);
        vehicleData.behavior ??= OWNED_VEHICLE;

        const beforeInjections = Injections.get<(document: IVehicle) => IVehicle>('VEHICLE_ADD_START');

        for (const callback of beforeInjections) {
            const result = callback(vehicleData);
            if (result) {
                vehicleData = result;
            }
        }

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
     * @return {Promise<boolean>}
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

        const beforeSpawnInjections = Injections.get<VehicleSpawnCallback>(VehicleInjectionNames[0]);
        for (const callback of beforeSpawnInjections) {
            const result = callback(document);

            if (result) {
                document = result;
            }
        }

        document = VehicleFuncs.convertOldTuningData(document);

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

        vehicle.setSyncedMeta(VEHICLE_SYNCED_META.DATABASE_ID, document._id.toString());
        vehicle.modelName = document.model;
        SpawnedVehicles[document.id] = vehicle;

        // Setup Default Values
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

        if (vehicle.data.damage) {
            this.setDamage(vehicle);
        }

        if (vehicle.data.dirtLevel) {
            vehicle.dirtLevel = vehicle.data.dirtLevel;
        }

        vehicle.numberPlateText = document.plate;
        vehicle.manualEngineControl = true;
        vehicle.lockState = VEHICLE_LOCK_STATE.LOCKED;

        VehicleFuncs.applyVehicleTuning(vehicle);

        // Synchronization
        if (pos && rot) {
            VehicleFuncs.save(vehicle, { garageIndex: null, position: pos, rotation: rot });
        } else {
            VehicleFuncs.save(vehicle, { garageIndex: null });
        }

        const afterSpawnInjections = Injections.get<VehicleSpawnCallback>(VehicleInjectionNames[1]);
        for (const callback of afterSpawnInjections) {
            const result = callback(document);

            if (result) {
                document = result;
            }
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

        const beforeDespawnInjections = Injections.get<VehicleDespawnCallback>(VehicleInjectionNames.DESPAWN_START);
        for (const callback of beforeDespawnInjections) {
            callback(SpawnedVehicles[id]);
        }

        VehicleEvents.trigger(ATHENA_EVENTS_VEHICLE.DESPAWNED, SpawnedVehicles[id]);

        try {
            SpawnedVehicles[id].destroy();
            delete SpawnedVehicles[id];
        } catch (err) {}

        return true;
    }

    /**
     * A session based owned vehicle.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} model
     * @param {alt.IVector3} pos
     * @param {alt.IVector3} rot
     * @memberof VehicleFuncs
     */
    static sessionVehicle(player: alt.Player, model: string, pos: alt.IVector3, rot: alt.IVector3) {
        const vehicle = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
        vehicle.player_id = player.id;
        vehicle.behavior =
            Vehicle_Behavior.NEED_KEY_TO_START | Vehicle_Behavior.NO_SAVE | Vehicle_Behavior.UNLIMITED_FUEL;

        vehicle.numberPlateText = 'SESSION';
        vehicle.lockState = VEHICLE_LOCK_STATE.LOCKED;
        vehicle.isTemporary = true;
        vehicle.modelName = model;
        vehicle.overrideTemporaryDeletion = true;
        
        if (player.dimension > 0) {
            vehicle.dimension = player.dimension;
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
            
        if (player.dimension > 0) {
            vehicle.dimension = player.dimension;
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

        const saveInjections = Injections.get<(vehicle: alt.Vehicle) => { [key: string]: any }>(
            VehicleInjectionNames.SAVE,
        );

        for (const callback of saveInjections) {
            try {
                injections = { ...injections, ...callback(vehicle) };
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

        if (vehicle.isTemporary) {
            return false;
        }

        if (!vehicle.data) {
            return true;
        }

        // Check Actual Ownership
        if (vehicle.data.owner === player.data._id.toString()) {
            return true;
        }

        const ownershipInjections = Injections.get<VehicleOwnershipCallback>(VehicleInjectionNames.OWNERSHIP);
        for (const callback of ownershipInjections) {
            const result = callback(player, vehicle);
            if (result) {
                return true;
            }
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
            damage: this.getDamage(vehicle),
            dirtLevel: vehicle.dirtLevel,
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
            name: LocaleController.get(LOCALE_KEYS.VEHICLE_KEY_NAME, vehicle.model),
            description: LocaleController.get(LOCALE_KEYS.VEHICLE_KEY_DESCRIPTION, vehicle.model),
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
                Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.INVENTORY_IS_FULL));
                return null;
            }

            if (!Athena.player.inventory.inventoryAdd(player, item, inventory.slot)) {
                Athena.player.emit.notification(player, LocaleController.get(LOCALE_KEYS.INVENTORY_IS_FULL));
                return null;
            }

            await Athena.state.set(player, 'inventory', player.data.inventory, true);
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

    static applyVehicleTuning(vehicle: alt.Vehicle): void {
        if (!vehicle?.data?.tuning) {
            vehicle.data.tuning = {};
        }

        const data = vehicle.data.tuning;

        if (typeof data.modkit !== 'undefined') {
            vehicle.modKit = data.modkit;
            if (typeof data.mods !== 'undefined') {
                data.mods.forEach((mod) => vehicle.setMod(mod.id, mod.value));
            }
        }

        if (typeof data.handling !== 'undefined') {
            vehicle.setStreamSyncedMeta('handlingData', data.handling);
        }

        if (typeof data.primaryFinish !== 'undefined') {
            vehicle.primaryColor = data.primaryFinish;
        }

        if (typeof data.secondaryFinish !== 'undefined') {
            vehicle.secondaryColor = data.secondaryFinish;
        }

        if (typeof data.primaryColor === 'undefined') {
            data.primaryColor = DEFAULT_VEHICLE_COLOR;
        }

        if (typeof data.secondaryColor === 'undefined') {
            data.secondaryColor = DEFAULT_VEHICLE_COLOR;
        }

        if (typeof data.primaryColor === 'number') {
            vehicle.primaryColor = data.primaryColor;
        } else {
            vehicle.customPrimaryColor = new alt.RGBA(
                data.primaryColor.r,
                data.primaryColor.g,
                data.primaryColor.b,
                data.primaryColor.a,
            );
        }

        if (typeof data.secondaryColor === 'number') {
            vehicle.secondaryColor = data.secondaryColor;
        } else {
            vehicle.customSecondaryColor = new alt.RGBA(
                data.secondaryColor.r,
                data.secondaryColor.g,
                data.secondaryColor.b,
                data.secondaryColor.a,
            );
        }

        if (data.customTires) vehicle.customTires = true;
        if (typeof data.darkness == 'number') {
            vehicle.darkness = data.darkness;
        }

        if (typeof data.dashboardColor == 'number') {
            vehicle.dashboardColor = data.dashboardColor;
        }

        if (typeof data.headlightColor == 'number') {
            vehicle.headlightColor = data.headlightColor;
        }

        if (typeof data.interiorColor == 'number') {
            vehicle.interiorColor = data.interiorColor;
        }

        if (typeof data.lightsMultiplier == 'number') {
            vehicle.lightsMultiplier = data.lightsMultiplier;
        }

        if (typeof data.livery == 'number') {
            vehicle.livery = data.livery;
        }

        vehicle.neon = {
            left: (data.neonEnabled && data.neon?.left) ?? false,
            right: (data.neonEnabled && data.neon?.right) ?? false,
            front: (data.neonEnabled && data.neon?.front) ?? false,
            back: (data.neonEnabled && data.neon?.back) ?? false,
        };

        if (data.neonColor) {
            vehicle.neonColor = new alt.RGBA(data.neonColor.r, data.neonColor.g, data.neonColor.b, data.neonColor.a);
        }

        if (typeof data.numberPlateIndex == 'number') {
            vehicle.numberPlateIndex = data.numberPlateIndex;
        }

        if (typeof data.pearlColor == 'number') {
            vehicle.pearlColor = data.pearlColor;
        }

        if (typeof data.roofLivery == 'number') {
            vehicle.roofLivery = data.roofLivery;
        }
        if (typeof data.roofState == 'boolean') {
            vehicle.roofState = data.roofState;
        }

        if (data.tireSmokeColor) {
            vehicle.tireSmokeColor = new alt.RGBA(
                data.tireSmokeColor.r,
                data.tireSmokeColor.g,
                data.tireSmokeColor.b,
                data.tireSmokeColor.a,
            );
        }

        if (typeof data.wheelColor == 'number') {
            vehicle.wheelColor = data.wheelColor;
        }

        if (typeof data.windowTint == 'number') {
            vehicle.windowTint = data.windowTint;
        }

        if (typeof data.driftModeEnabled == 'boolean') {
            vehicle.driftModeEnabled = data.driftModeEnabled;
        }
    }

    private static convertOldTuningData(vehicle: IVehicle): IVehicle {
        let hasChanged = false;

        if (vehicle.pearl) {
            if (!vehicle.tuning) vehicle.tuning = {};
            vehicle.tuning.pearlColor = vehicle.pearl;
            delete vehicle.pearl;
            hasChanged = true;
        }

        if (vehicle.color) {
            if (!vehicle.tuning) vehicle.tuning = {};

            if (typeof vehicle.color == 'number') vehicle.tuning.primaryColor = vehicle.color;
            else
                vehicle.tuning.primaryColor = new alt.RGBA(
                    vehicle.color.r,
                    vehicle.color.g,
                    vehicle.color.b,
                    vehicle.color.a,
                );

            delete vehicle.color;
            hasChanged = true;
        }

        if (vehicle.color2) {
            if (!vehicle.tuning) vehicle.tuning = {};

            if (typeof vehicle.color2 == 'number') vehicle.tuning.secondaryColor = vehicle.color2;
            else
                vehicle.tuning.secondaryColor = new alt.RGBA(
                    vehicle.color2.r,
                    vehicle.color2.g,
                    vehicle.color2.b,
                    vehicle.color2.a,
                );

            delete vehicle.color2;
            hasChanged = true;
        }

        if (vehicle.finish1) {
            if (!vehicle.tuning) vehicle.tuning = {};
            vehicle.tuning.primaryFinish = vehicle.finish1;
            delete vehicle.finish1;
            hasChanged = true;
        }

        if (vehicle.finish2) {
            if (!vehicle.tuning) vehicle.tuning = {};
            vehicle.tuning.secondaryFinish = vehicle.finish2;
            delete vehicle.finish2;
            hasChanged = true;
        }

        if (hasChanged)
            Athena.database.funcs.removePartialData(
                vehicle._id,
                { color: true, color2: true, finish1: true, finish2: true, pearl: true },
                Athena.database.collections.Vehicles,
            );

        return vehicle;
    }

    static setModKit(vehicle: alt.Vehicle, modKit: number): void {
        if (!vehicle?.valid) return;

        vehicle.modKit = modKit;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.modkit = modKit;
        }
    }

    static setMod(vehicle: alt.Vehicle, id: number, value: number): void {
        if (!vehicle?.valid) return;

        if (value < 0) {
            VehicleFuncs.removeMod(vehicle, id);
            return;
        }

        vehicle.setMod(id, value);

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            if (!vehicle.data?.tuning.mods) vehicle.data.tuning.mods = [];

            vehicle.data.tuning.mods.push({ id, value });
        }
    }

    static removeMod(vehicle: alt.Vehicle, id: number): void {
        if (!vehicle?.valid) return;
        vehicle.setMod(id, 0);

        if (vehicle.data?.tuning?.mods) {
            vehicle.data.tuning.mods = vehicle.data.tuning.mods.filter((mod) => mod.id !== id);
        }
    }

    static setHandling(vehicle: alt.Vehicle, key: keyof IVehicleHandling, value: number): void {
        if (!vehicle?.valid) return;

        const handlingData = VehicleFuncs.getHandling(vehicle);
        handlingData[<string>key] = value;
        vehicle.setStreamSyncedMeta('handlingData', handlingData);

        if (!vehicle.isTemporary) {
            if (!vehicle.data.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.handling = handlingData;
        }
    }

    static getHandling(vehicle: alt.Vehicle): Partial<IVehicleHandling> {
        if (!vehicle?.valid) return {};

        return vehicle.getStreamSyncedMeta('handlingData') ?? {};
    }

    static removeHandling(vehicle: alt.Vehicle, key: keyof IVehicleHandling): void {
        if (!vehicle?.valid) return;

        const handlingData = VehicleFuncs.getHandling(vehicle);
        delete handlingData[<string>key];
        vehicle.setStreamSyncedMeta('handlingData', handlingData);

        if (!vehicle.isTemporary) {
            if (!vehicle.data.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.handling = handlingData;
        }
    }

    static setPrimaryColor(vehicle: alt.Vehicle, color: number | alt.RGBA): void {
        if (!vehicle?.valid) return;

        if (typeof color == 'number') vehicle.primaryColor = color;
        else vehicle.customPrimaryColor = color;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.primaryColor = color;
        }
    }

    static setPrimaryFinish(vehicle: alt.Vehicle, finish: number): void {
        if (!vehicle?.valid) return;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.primaryFinish = finish;
        }
    }

    static setSecondaryColor(vehicle: alt.Vehicle, color: number | alt.RGBA): void {
        if (!vehicle?.valid) return;

        if (typeof color == 'number') vehicle.secondaryColor = color;
        else vehicle.customSecondaryColor = color;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.secondaryColor = color;
        }
    }

    static setSecondaryFinish(vehicle: alt.Vehicle, finish: number): void {
        if (!vehicle?.valid) return;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.secondaryFinish = finish;
        }
    }

    static setPearlColor(vehicle: alt.Vehicle, color: number): void {
        if (!vehicle?.valid) return;
        vehicle.pearlColor = color;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.pearlColor = color;
        }
    }

    static setTires(vehicle: alt.Vehicle, customTires: boolean): void {
        if (!vehicle?.valid) return;
        vehicle.customTires = customTires;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.customTires = customTires;
        }
    }

    static setDarkness(vehicle: alt.Vehicle, darkness: number): void {
        if (!vehicle?.valid) return;
        vehicle.darkness = darkness;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.darkness = darkness;
        }
    }

    static setDashboardColor(vehicle: alt.Vehicle, color: number): void {
        if (!vehicle?.valid) return;
        vehicle.dashboardColor = color;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.dashboardColor = color;
        }
    }

    static setHeadlightColor(vehicle: alt.Vehicle, color: number): void {
        if (!vehicle?.valid) return;
        vehicle.headlightColor = color;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.headlightColor = color;
        }
    }

    static setInteriorColor(vehicle: alt.Vehicle, color: number): void {
        if (!vehicle?.valid) return;
        vehicle.interiorColor = color;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.interiorColor = color;
        }
    }

    static setLightsMultiplier(vehicle: alt.Vehicle, multiplier: number): void {
        if (!vehicle?.valid) return;
        vehicle.lightsMultiplier = multiplier;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.lightsMultiplier = multiplier;
        }
    }

    static setLivery(vehicle: alt.Vehicle, livery: number): void {
        if (!vehicle?.valid) return;
        vehicle.livery = livery;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.livery = livery;
        }
    }

    static setRoofLivery(vehicle: alt.Vehicle, livery: number): void {
        if (!vehicle?.valid) return;
        vehicle.roofLivery = livery;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.roofLivery = livery;
        }
    }

    static setNeon(vehicle: alt.Vehicle, neon: Partial<alt.IVehicleNeon>): void {
        if (!vehicle?.valid) return;

        vehicle.neon = {
            left: neon.left ?? false,
            right: neon.right ?? false,
            front: neon.front ?? false,
            back: neon.back ?? false,
        };

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.neon = neon;
        }
    }

    static setNeonLightsEnabled(vehicle: alt.Vehicle, enabled: boolean): void {
        if (!vehicle?.valid || vehicle.isTemporary) return;

        if (!vehicle.data?.tuning) vehicle.data.tuning = {};
        vehicle.data.tuning.neonEnabled = enabled;

        // Purely for Clientside UI
        vehicle.setStreamSyncedMeta('neonLightsEnabled', enabled);

        const neonLights = vehicle.data.tuning.neon ?? {};

        vehicle.neon = {
            left: (enabled && neonLights.left) ?? false,
            right: (enabled && neonLights.right) ?? false,
            front: (enabled && neonLights.front) ?? false,
            back: (enabled && neonLights.back) ?? false,
        };
    }

    static setNeonColor(vehicle: alt.Vehicle, color: alt.RGBA): void {
        if (!vehicle?.valid) return;
        vehicle.neonColor = color;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.neonColor = color;
        }
    }

    static setNumberPlateIndex(vehicle: alt.Vehicle, index: number): void {
        if (!vehicle?.valid) return;
        vehicle.numberPlateIndex = index;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.numberPlateIndex = index;
        }
    }

    static setRoofState(vehicle: alt.Vehicle, state: boolean): void {
        if (!vehicle?.valid) return;
        vehicle.roofState = state;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.roofState = state;
        }
    }

    static setTireSmokeColor(vehicle: alt.Vehicle, color: alt.RGBA): void {
        if (!vehicle?.valid) return;
        vehicle.tireSmokeColor = color;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.tireSmokeColor = color;
        }
    }

    static setWheelColor(vehicle: alt.Vehicle, color: number): void {
        if (!vehicle?.valid) return;
        vehicle.wheelColor = color;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.wheelColor = color;
        }
    }

    static setWindowTint(vehicle: alt.Vehicle, tint: alt.WindowTint): void {
        if (!vehicle?.valid) return;
        vehicle.windowTint = tint;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.windowTint = tint;
        }
    }

    static setDriftModeEnabled(vehicle: alt.Vehicle, enabled: boolean): void {
        if (!vehicle?.valid) return;
        vehicle.driftModeEnabled = enabled;

        if (!vehicle.isTemporary) {
            if (!vehicle.data?.tuning) vehicle.data.tuning = {};
            vehicle.data.tuning.driftModeEnabled = enabled;
        }
    }

    static getDamage(vehicle: alt.Vehicle): IVehicleDamage {
        if (!vehicle?.valid) return null;
        let wheels = [];
        for (let w = 0; w < vehicle.wheelsCount; w++) {
            wheels[w] = {
                damageLevel: vehicle.getWheelHealth(w).toString(),
            };
        }
        return {
            parts: {
                FrontLeft: {
                    bulletHoles: vehicle.getPartBulletHoles(0),
                    damageLevel: vehicle.getPartDamageLevel(0).toString(),
                },
                FrontRight: {
                    bulletHoles: vehicle.getPartBulletHoles(1),
                    damageLevel: vehicle.getPartDamageLevel(1).toString(),
                },
                MiddleLeft: {
                    bulletHoles: vehicle.getPartBulletHoles(2),
                    damageLevel: vehicle.getPartDamageLevel(2).toString(),
                },
                MiddleRight: {
                    bulletHoles: vehicle.getPartBulletHoles(3),
                    damageLevel: vehicle.getPartDamageLevel(3).toString(),
                },
                RearLeft: {
                    bulletHoles: vehicle.getPartBulletHoles(4),
                    damageLevel: vehicle.getPartDamageLevel(4).toString(),
                },
                RearRight: {
                    bulletHoles: vehicle.getPartBulletHoles(5),
                    damageLevel: vehicle.getPartDamageLevel(5).toString(),
                },
            },
            windows: {
                DriverSideFront: {
                    damageLevel: vehicle.isWindowDamaged(1) ? '1' : '0',
                },
                DriverSideRear: {
                    damageLevel: vehicle.isWindowDamaged(3) ? '1' : '0',
                },
                PassSideFront: {
                    damageLevel: vehicle.isWindowDamaged(0) ? '1' : '0',
                },
                PassSideRear: {
                    damageLevel: vehicle.isWindowDamaged(2) ? '1' : '0',
                },
                FrontWindshield: {
                    damageLevel: vehicle.isWindowDamaged(6) ? '1' : '0',
                },
                RearWindshield: {
                    damageLevel: vehicle.isWindowDamaged(7) ? '1' : '0',
                },
            },
            bumpers: {
                FrontBumper: {
                    damageLevel: vehicle.getBumperDamageLevel(0).toString(),
                },
                RearBumper: {
                    damageLevel: vehicle.getBumperDamageLevel(1).toString(),
                },
            },
            wheels: wheels,
            lights: [],
        };
    }

    static setDamage(vehicle: alt.Vehicle): void {
        if (!vehicle?.valid) {
            return;
        }

        if (!vehicle.data.damage) {
            return;
        }

        if (vehicle.data.damage.parts) {
            for (let part in vehicle.data.damage.parts) {
                let damages = vehicle.data.damage.parts[part];
                let vehPart = this.getVehiclePart(part);
                vehicle.setPartBulletHoles(vehPart, damages.bulletHoles);
                vehicle.setPartDamageLevel(vehPart, this.getDamageLevel(damages.damageLevel));
            }
        }

        if (vehicle.data.damage.windows) {
            for (let part in vehicle.data.damage.windows) {
                let damages = vehicle.data.damage.windows[part];
                let vehPart = this.getVehiclePart(part);
                vehicle.setWindowDamaged(vehPart, parseInt(damages.damageLevel) >= 1 ? true : false);
            }
        }

        if (vehicle.data.damage.bumpers) {
            for (let part in vehicle.data.damage.bumpers) {
                let damages = vehicle.data.damage.bumpers[part];
                let vehPart = this.getVehiclePart(part);
                vehicle.setBumperDamageLevel(vehPart, this.getDamageLevel(damages.damageLevel));
            }
        }

        if (vehicle.data.damage.wheels) {
            for (let w = 0; w < vehicle.data.damage.wheels.length; w++) {
                vehicle.setWheelHealth(w, parseInt(vehicle.data.damage.wheels[w].damageLevel));
            }
        }
    }

    static getDamageLevel(level: string): number {
        switch (level) {
            case 'DamagedLevel1':
                return 1;
            case 'DamagedLevel2':
                return 2;
            case 'DamagedLevel3':
                return 3;
            case 'NotDamaged':
                return 0;
            case 'Damaged':
                return 1;
            case 'None':
                return 2;
            default:
                return 0;
        }
    }

    static getVehiclePart(part: string): number {
        switch (part) {
            case 'FrontLeft':
                return 0;
            case 'FrontRight':
                return 1;
            case 'MiddleLeft':
                return 2;
            case 'MiddleRight':
                return 3;
            case 'RearLeft':
                return 4;
            case 'RearRight':
                return 5;
            case 'FrontBumper':
                return 0;
            case 'RearBumper':
                return 1;
            case 'PassSideFront':
                return 0;
            case 'DriverSideFront':
                return 1;
            case 'PassSideFront':
                return 2;
            case 'PassSideRear':
                return 3;
            case 'FrontWindshield':
                return 6;
            case 'RearWindshield':
                return 7;
            default:
                return 0;
        }
    }
}
