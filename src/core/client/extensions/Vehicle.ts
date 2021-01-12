import * as alt from 'alt-client';
import { Vector3 } from 'alt-client';
import * as native from 'natives';
import { Vehicle_Door_List } from '../../shared/enums/vehicle';
import { getClosestVectorByPos } from '../../shared/utility/vector';
import { sleep } from '../utility/sleep';

const closestDoorBones = [
    { name: 'seat_dside_f', seat: -1, isDoor: false },
    { name: 'seat_pside_f', seat: 0, isDoor: false },
    { name: 'seat_dside_r', seat: 1, isDoor: false },
    { name: 'seat_pside_r', seat: 2, isDoor: false },
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

        getClosestDoor(position: alt.Vector3): DoorData;

        toggleDoor(door: number);

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
    }
}

alt.Vehicle.prototype.closeAllDoors = function closeAllDoors(): void {
    const v: alt.Vehicle = this as alt.Vehicle;
    if (!this.doorStates) {
        this.doorStates = {};
    }

    for (let doorIndex in Vehicle_Door_List) {
        native.setVehicleDoorShut(v.scriptID, parseInt(doorIndex), true);
        v.doorStates[doorIndex] = false;
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
    const positions: { index: number; pos: alt.Vector3 }[] = [];

    for (let i = 0; i < closestDoorBones.length; i++) {
        const boneIndex = native.getEntityBoneIndexByName(this.scriptID, closestDoorBones[i].name);
        const worldPos = native.getWorldPositionOfEntityBone(this.scriptID, boneIndex);
        positions.push({ index: i, pos: worldPos as alt.Vector3 });
    }

    const closestPos = getClosestVectorByPos<{ index: number; pos: alt.Vector3 }>(position, positions);
    const seat = closestDoorBones[closestPos.index].seat;
    const isDoor = closestDoorBones[closestPos.index].isDoor;

    return { pos: closestPos.pos, seat: seat, isDoor: isDoor };
};

alt.Vehicle.prototype.toggleDoor = function toggleDoor(door: Vehicle_Door_List) {
    if (!this.doorStates) {
        this.doorStates = {};
    }

    this.doorStates[door] = !this.doorStates[door] ? true : false;

    if (!this.doorStates[door]) {
        native.setVehicleDoorShut(this.scriptID, door, true);
    } else {
        native.setVehicleDoorOpen(this.scriptID, door, false, true);
    }
};
