import * as alt from 'alt-client';
import * as native from 'natives';
import { Vehicle_Door_List, Vehicle_Lock_State } from '../../../shared/enums/vehicle';
import { getClosestVectorByPos } from '../../../shared/utility/vector';
import { DoorData } from '../Vehicle';

const closestDoorBones = [
    { name: 'handle_dside_f', seat: -1, isDoor: false },
    { name: 'handle_pside_f', seat: 0, isDoor: false },
    { name: 'handle_dside_r', seat: 1, isDoor: false },
    { name: 'handle_pside_r', seat: 2, isDoor: false },
    { name: 'bonnet', seat: 4, isDoor: true },
    { name: 'boot', seat: 5, isDoor: true }
];

/**
 * Return the closest door to a position.
 * @param {alt.Vector3} position
 * @return {*}  {DoorData}
 * @memberof Vehicle
 */
function closestDoor(v: alt.Vehicle, position: alt.Vector3): DoorData {
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
}
/**
 * Check if a door is open.
 * @param {Vehicle_Door_List} door
 * @return {*}  {boolean}
 * @memberof Vehicle
 */
function doorOpen(v: alt.Vehicle, door: Vehicle_Door_List): boolean {
    if (!v.doorStates) {
        return false;
    }

    if (!v.doorStates[door]) {
        return false;
    }

    return v.doorStates[door];
}

function canExit(v: alt.Vehicle) {
    if (v.lockStatus === Vehicle_Lock_State.UNLOCKED || v.lockStatus === Vehicle_Lock_State.NO_LOCK) {
        return true;
    }

    return false;
}

/**
 * Check if this person is the vehicle owner.
 * @memberof Vehicle
 */
function owner(v: alt.Vehicle): boolean {
    return v.owner === alt.Player.local.id;
}

export default {
    closestDoor,
    doorOpen,
    owner,
    canExit
};
