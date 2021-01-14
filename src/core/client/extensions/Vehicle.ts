import * as alt from 'alt-client';
import { Vector3 } from 'alt-client';
import * as native from 'natives';
import { Vehicle_Door_List, Vehicle_State } from '../../shared/enums/vehicle';
import { getClosestVectorByPos } from '../../shared/utility/vector';
import { sleep } from '../utility/sleep';

alt.on('gameEntityCreate', handleEntityCreation);

const closestDoorBones = [
    { name: 'handle_dside_f', seat: -1, isDoor: false },
    { name: 'handle_pside_f', seat: 0, isDoor: false },
    { name: 'handle_dside_r', seat: 1, isDoor: false },
    { name: 'handle_pside_r', seat: 2, isDoor: false },
    { name: 'bonnet', seat: 4, isDoor: true },
    { name: 'exhaust', seat: 5, isDoor: true }
];

export interface DoorData {
    pos: Vector3;
    seat: number;
    isDoor?: boolean;
}

declare module 'alt-client' {
    export interface Vehicle {
        doorStates: { [doorNumber: number]: boolean };
        owner: string | number;
        engineStatus: boolean;

        /**
         * Resyncs the vehicle after leaving stream distance.
         * @memberof Vehicle
         */
        handleSyncIn(): void;

        /**
         * Return the closest door to a position.
         * @param {alt.Vector3} position
         * @return {*}  {DoorData}
         * @memberof Vehicle
         */
        getClosestDoor(position: alt.Vector3): DoorData;

        /**
         * Check if a door is open.
         * @param {Vehicle_Door_List} door
         * @return {*}  {boolean}
         * @memberof Vehicle
         */
        isDoorOpen(door: Vehicle_Door_List): boolean;

        /**
         * Set the door state. True is open.
         * @param {Vehicle_Door_List} door
         * @param {boolean} value
         * @memberof Vehicle
         */
        setDoorState(door: Vehicle_Door_List, value: boolean): void;

        /**
         * Toggle a local vehicle's door state.
         * Does not sync up with server.
         * @param {number} door
         * @memberof Vehicle
         */
        toggleDoor(door: Vehicle_Door_List): void;

        /**
         * Force all doors to be closed.
         * @memberof Vehicle
         */
        closeAllDoors(): void;

        /**
         * Flash vehicle lights multiple times.
         * @param {number} numberOfTimes
         * @param {number} delayBetween
         * @return {*}  {Promise<void>}
         * @memberof Vehicle
         */
        flashLights(numberOfTimes: number, delayBetween: number): Promise<void>;

        /**
         * Play the carn horn multiple times.
         * @param {number} numberOfTimes
         * @param {number} lengthOfHorn
         * @return {*}  {Promise<void>}
         * @memberof Vehicle
         */
        playCarAlarmHorn(numberOfTimes: number, lengthOfHorn: number): Promise<void>;

        /**
         * Set the owner of this vehicle locally.
         * @param {*} id
         * @memberof Vehicle
         */
        setOwner(id: any): void;

        /**
         * Set the engine status of the vehicle.
         * @param {boolean} value
         * @memberof Vehicle
         */
        setEngine(value: boolean): void;
    }
}

alt.Vehicle.prototype.closeAllDoors = function closeAllDoors(): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    if (!this.doorStates) {
        this.doorStates = {};
    }

    for (let doorIndex in Vehicle_Door_List) {
        v.doorStates[doorIndex] = false;

        if (!native.isVehicleDoorFullyOpen(v.scriptID, parseInt(doorIndex))) {
            continue;
        }

        native.setVehicleDoorShut(v.scriptID, parseInt(doorIndex), false);
    }
};

alt.Vehicle.prototype.flashLights = async function flashLights(numberOfTimes: number, delay: number): Promise<void> {
    const v: alt.Vehicle = this as alt.Vehicle;
    let count = 0;

    // Don't flash if the player is in the vehicle.
    if (alt.Player.local.vehicle === v) {
        return;
    }

    const interval = alt.setInterval(() => {
        native.setVehicleLights(v.scriptID, 0); // Lights Off
        if (count > numberOfTimes) {
            alt.clearInterval(interval);
            return;
        }

        native.setVehicleLights(v.scriptID, 2); // Normal Lights
        count += 1;
    }, delay);
};

alt.Vehicle.prototype.playCarAlarmHorn = async function playCarAlarmHorn(
    numberOfTimes: number,
    lengthOfHorn: number
): Promise<void> {
    const v: alt.Vehicle = this as alt.Vehicle;

    // Don't flash if the player is in the vehicle.
    if (alt.Player.local.vehicle === v) {
        return;
    }

    for (let i = 0; i < numberOfTimes; i++) {
        native.startVehicleHorn(v.scriptID, lengthOfHorn, 0, false);
        await sleep(lengthOfHorn + 25);
    }
};

alt.Vehicle.prototype.getClosestDoor = function getClosestDoor(position: alt.Vector3): DoorData {
    const v: alt.Vehicle = this as alt.Vehicle;
    const positions: { index: number; pos: alt.Vector3 }[] = [];

    for (let i = 0; i < closestDoorBones.length; i++) {
        const boneIndex = native.getEntityBoneIndexByName(v.scriptID, closestDoorBones[i].name);
        const worldPos = native.getWorldPositionOfEntityBone(v.scriptID, boneIndex);
        positions.push({ index: i, pos: worldPos as alt.Vector3 });
    }

    const closestPos = getClosestVectorByPos<{ index: number; pos: alt.Vector3 }>(position, positions);
    const seat = closestDoorBones[closestPos.index].seat;
    const isDoor = closestDoorBones[closestPos.index].isDoor;

    return { pos: closestPos.pos, seat: seat, isDoor: isDoor };
};

alt.Vehicle.prototype.isDoorOpen = function isDoorOpen(door: Vehicle_Door_List): boolean {
    const v: alt.Vehicle = this as alt.Vehicle;
    if (!v.doorStates) {
        return false;
    }

    if (!v.doorStates[door]) {
        return false;
    }

    return v.doorStates[door];
};

alt.Vehicle.prototype.setDoorState = function setDoorState(door: Vehicle_Door_List, value: boolean): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    if (!v.doorStates) {
        v.doorStates = {};
    }

    v.doorStates[door] = value;
    if (!v.doorStates[door]) {
        native.setVehicleDoorShut(v.scriptID, door, false);
        return;
    }

    native.setVehicleDoorOpen(v.scriptID, door, false, false);
};

alt.Vehicle.prototype.toggleDoor = function toggleDoor(door: Vehicle_Door_List): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    if (!v.doorStates) {
        v.doorStates = {};
    }

    v.doorStates[door] = !v.doorStates[door] ? true : false;

    if (!v.doorStates[door]) {
        native.setVehicleDoorShut(v.scriptID, door, false);
        return;
    }

    native.setVehicleDoorOpen(v.scriptID, door, false, false);
};

alt.Vehicle.prototype.setOwner = function setOwner(id: string | number): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    v.owner = id;
};

alt.Vehicle.prototype.setEngine = function setEngine(value: boolean): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    v.engineStatus = value;
    native.setVehicleEngineOn(v.scriptID, value, false, false);
};

alt.Vehicle.prototype.handleSyncIn = function handleSyncIn(): void {
    const v: alt.Vehicle = this as alt.Vehicle;

    // Synchronize All States for Local Data
    v.engineStatus = v.getStreamSyncedMeta(Vehicle_State.ENGINE);
    v.doorStates[0] = v.getStreamSyncedMeta(Vehicle_State.DOOR_DRIVER);
    v.doorStates[1] = v.getStreamSyncedMeta(Vehicle_State.DOOR_PASSENGER);
    v.doorStates[2] = v.getStreamSyncedMeta(Vehicle_State.DOOR_DRIVER_REAR);
    v.doorStates[3] = v.getStreamSyncedMeta(Vehicle_State.DOOR_PASSENGER_REAR);
    v.doorStates[4] = v.getStreamSyncedMeta(Vehicle_State.DOOR_HOOD);
    v.doorStates[5] = v.getStreamSyncedMeta(Vehicle_State.DOOR_TRUNK);

    native.setVehicleEngineOn(v.scriptID, v.engineStatus, false, false);

    Object.keys(v.doorStates).forEach((doorNumber) => {
        if (v.doorStates[doorNumber]) {
            native.setVehicleDoorOpen(v.scriptID, parseInt(doorNumber), false, true);
        } else {
            native.setVehicleDoorShut(v.scriptID, parseInt(doorNumber), true);
        }
    });
};

function handleEntityCreation(entity: alt.Entity): void {
    if (!(entity instanceof alt.Vehicle)) {
        return;
    }

    alt.setTimeout(() => {
        entity.handleSyncIn();
    }, 500);
}
