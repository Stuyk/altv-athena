import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { StreamerService } from '../systems/streamer';
import { Door } from '@AthenaShared/interfaces/door';
import { Doors } from '@AthenaShared/information/doors';
import Database from '@stuyk/ezmongodb';
import { Collections } from '@AthenaServer/database/collections';
import { sha256Random } from '@AthenaServer/utility/hash';

type DoorDocument = Door & { _id?: unknown };

const KEY = 'doors';
const globalDoors: Array<Door> = [];

const InternalController = {
    async init() {
        StreamerService.registerCallback(KEY, InternalController.update, 25);

        for (let door of Doors) {
            globalDoors.push(door);
        }

        await Database.createCollection(Collections.Doors, false);
        const savedDoors = await Database.fetchAllData<DoorDocument>(Collections.Doors);
        if (savedDoors.length <= 0) {
            InternalController.refresh();
            return;
        }

        for (let door of savedDoors) {
            const index = globalDoors.findIndex((x) => x.uid === door.uid);
            if (index <= -1) {
                continue;
            }

            globalDoors[index].isUnlocked = door.isUnlocked;
        }

        InternalController.refresh();
    },
    refresh() {
        StreamerService.updateData(KEY, globalDoors);
    },
    update(player: alt.Player, doors: Array<Door>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_DOORS, doors);
    },
};

/**
 * Append door information to be controlled.
 * Returns the door uid to remove all door controls if necessary.
 *
 * @param {Door} door
 * @return {string}
 */
export function append(door: Door): string {
    if (!door.uid) {
        door.uid = sha256Random(JSON.stringify(door));
    }

    globalDoors.push(door);
    InternalController.refresh();
    return door.uid;
}

/**
 * Remove all controls from a door.
 *
 * @param {string} uid
 * @return {boolean}
 */
export function remove(uid: string): boolean {
    const index = globalDoors.findIndex((label) => label.uid === uid);
    if (index <= -1) {
        return false;
    }

    globalDoors.splice(index, 1);
    InternalController.refresh();
    return true;
}

/**
 * Update door lock status.
 * Call this function to change door controls.
 *
 * @param {string} uid
 * @param {boolean} isUnlocked
 * @return {boolean}
 */
export async function update(uid: string, isUnlocked: boolean): Promise<boolean> {
    const index = globalDoors.findIndex((label) => label.uid === uid);
    if (index <= -1) {
        return false;
    }

    globalDoors[index].isUnlocked = isUnlocked;
    InternalController.refresh();

    const existingDoor = await Database.fetchData<DoorDocument>('uid', uid, Collections.Doors);

    if (existingDoor) {
        await Database.updatePartialData(existingDoor._id.toString(), { isUnlocked: isUnlocked }, Collections.Doors);
    } else {
        await Database.insertData(globalDoors[index], Collections.Doors);
    }

    return true;
}

InternalController.init();

interface DoorControllerFuncs extends ControllerFuncs<typeof append, typeof remove> {
    update: typeof update;
}

const Overrides: Partial<DoorControllerFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'update', callback: typeof update);
/**
 * Used to override any door streamer functionaltiy
 *
 * @export
 * @param {keyof DoorControllerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof DoorControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
