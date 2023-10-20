import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

import { Door } from '@AthenaShared/interfaces/door.js';
import { Doors } from '@AthenaShared/information/doors.js';
import Database from '@stuyk/ezmongodb';
import { Collections } from '@AthenaServer/database/collections.js';
import { ControllerFuncs } from './shared.js';
import { deepCloneObject } from '@AthenaShared/utility/deepCopy.js';

type DoorDocument = Door & { _id?: unknown };

const MAX_MARKERS_TO_DRAW = 10;
const doorGroup = new alt.VirtualEntityGroup(MAX_MARKERS_TO_DRAW);
const globalDoors: (Door & { entity: alt.VirtualEntity })[] = [];

const InternalController = {
    create(door: Door) {
        const entity = new alt.VirtualEntity(doorGroup, new alt.Vector3(door.pos), 15, { door, type: 'door' });
        globalDoors.push({ ...door, entity });
    },
    async init() {
        for (let door of Doors) {
            InternalController.create(door);
        }

        await Database.createCollection(Collections.Doors, false);
        const savedDoors = await Database.fetchAllData<DoorDocument>(Collections.Doors);

        for (let door of savedDoors) {
            const index = globalDoors.findIndex((x) => x.uid === door.uid);
            if (index <= -1) {
                InternalController.create(door);
                continue;
            }

            globalDoors[index].isUnlocked = door.isUnlocked;
            globalDoors[index].entity.setStreamSyncedMeta('door', deepCloneObject(globalDoors[index]));
        }
    },
};

/**
 * Append door information to be controlled.
 *
 * Returns the door uid to remove all door controls if necessary.
 *
 * All doors in the game are already added to the gamemode by default.
 *
 * #### Example
 * ```ts
 * const uid = Athena.controllers.doors.append({
 *   uid: 'my-cool-door-or-whatever',
 *   description: 'Pacific Standard Bank Main Right Door',
 *   isUnlocked: true,
 *   model: 110411286,
 *   pos: { x: 232.6054, y: 214.1584, z: 106.4049 },
 * });
 * ```
 *
 * @param {Door} door
 * @return {string}
 */
export function append(door: Door): string {
    if (Overrides.append) {
        return Overrides.append(door);
    }

    if (!door.uid) {
        door.uid = Athena.utility.hash.sha256Random(JSON.stringify(door));
    }

    InternalController.create(door);
    return door.uid;
}

/**
 * Get all available doors registered in the world currently
 *
 * @export
 * @return {(Array<Door & { entity: alt.VirtualEntity }>)}
 */
export function getDoors(): Array<Door & { entity: alt.VirtualEntity }> {
    return globalDoors;
}

/**
 * Remove all controls from a door.
 *
 * #### Example
 * ```ts
 * // uid is a variable here
 * Athena.controllers.doors.remove(uid);
 * ```
 *
 * @param {string} uid A unique string
 * @return {boolean}
 */
export function remove(uid: string): boolean {
    if (Overrides.remove) {
        return Overrides.remove(uid);
    }

    const index = globalDoors.findIndex((label) => label.uid === uid);
    if (index <= -1) {
        return false;
    }

    try {
        globalDoors[index].entity.destroy();
    } catch (err) {}

    globalDoors.splice(index, 1);
    return true;
}

/**
 * Update door lock status.
 *
 * Call this function to change door lock status.
 *
 * #### Example
 * ```ts
 * // set to true to unlock
 * Athena.controllers.doors.update('117', true);
 * ```
 *
 * @param {string} uid A unique string
 * @param {boolean} isUnlocked
 * @return {boolean}
 */
export async function update(uid: string, isUnlocked: boolean): Promise<boolean> {
    if (Overrides.update) {
        return Overrides.update(uid, isUnlocked);
    }

    const index = globalDoors.findIndex((door) => door.uid === uid);
    if (index <= -1) {
        return false;
    }

    globalDoors[index].isUnlocked = isUnlocked;
    globalDoors[index].entity.setStreamSyncedMeta('door', deepCloneObject(globalDoors[index]));

    const existingDoor = await Database.fetchData<DoorDocument>('uid', uid, Collections.Doors);

    if (existingDoor) {
        await Database.updatePartialData(existingDoor._id.toString(), { isUnlocked: isUnlocked }, Collections.Doors);
    } else {
        await Database.insertData(globalDoors[index], Collections.Doors);
    }

    return true;
}

Athena.systems.plugins.addCallback(InternalController.init);

type DoorControllerFuncs = ControllerFuncs<typeof append, typeof remove, void, void, typeof update>;

const Overrides: Partial<DoorControllerFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'update', callback: typeof update);
/**
 * Used to override any door streamer functionaltiy
 *
 *
 * @param {keyof DoorControllerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof DoorControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
