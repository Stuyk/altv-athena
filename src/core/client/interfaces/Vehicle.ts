import * as alt from 'alt-client';
import { Vector3 } from 'alt-client';
import * as native from 'natives';
import { getClosestVectorByPos } from '../../shared/utility/vector';

const closestDoorBones = [
    { name: 'handle_dside_f', seat: -1 },
    { name: 'handle_pside_f', seat: 0 },
    { name: 'handle_dside_r', seat: 1 },
    { name: 'handle_pside_r', seat: 2 },
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

        enterVehicle(player: alt.Player, seat: number): void;

        toggleDoor(door: number);
    }
}

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

alt.Vehicle.prototype.toggleDoor = function toggleDoor(door: number) {
    if (!this.doorStates) {
        this.doorStates = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false
        };
    }

    this.doorStates[door] = !this.doorStates[door];
    alt.log(`Door State is: ${this.doorStates[door]}`);

    if (!this.doorStates[door]) {
        native.setVehicleDoorShut(this.scriptID, door, true);
    } else {
        native.setVehicleDoorOpen(this.scriptID, door, false, true);
    }
};
