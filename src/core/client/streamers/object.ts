import * as alt from 'alt-client';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { Timer } from '@AthenaClient/utility/timers';
import { IObject } from '@AthenaShared/interfaces/iObject';

type CreatedObject = IObject & { createdObject?: alt.Object };

let persistentObjects: Array<CreatedObject> = [];
let createdObjects: Array<CreatedObject> = [];
let interval: number;

/**
 * Do Not Export Internal Only
 */
const InternalFunctions = {
    init() {
        createdObjects = [];
    },
    stop() {
        if (!interval) {
            return;
        }

        Timer.clearInterval(interval);
    },
    addObject(newObject: IObject) {
        if (persistentObjects.length >= 64) {
            throw new Error(`Exceeded User Object Count. Ensure you are removing objects for individual players.`);
        }

        const persistentIndex = persistentObjects.findIndex((x) => x.uid === newObject.uid);
        if (persistentIndex >= 0) {
            return;
        }

        const createdObject = new alt.Object(
            newObject.model,
            new alt.Vector3(newObject.pos),
            new alt.Vector3(0, 0, 0),
            true,
            false,
        );

        if (newObject.noCollision) {
            createdObject.toggleCollision(false, false);
        }

        createdObject.setPositionFrozen(true);
        persistentObjects.push({ ...newObject, createdObject });
    },
    removeObject(uid: string) {
        const persistentIndex = persistentObjects.findIndex((x) => x.uid === uid);
        if (persistentIndex <= -1) {
            return;
        }

        if (persistentObjects[persistentIndex].createdObject) {
            persistentObjects[persistentIndex].createdObject.destroy();
        }

        persistentObjects.splice(persistentIndex, 1);
    },
    moveObject(uid: string, pos: alt.IVector3) {
        const persistentIndex = persistentObjects.findIndex((x) => x.uid === uid);
        if (persistentIndex >= 0) {
            persistentObjects[persistentIndex].pos = pos;
            if (!persistentObjects[persistentIndex].createdObject) {
                return;
            }

            persistentObjects[persistentIndex].createdObject.pos = new alt.Vector3(pos);
            return;
        }

        const globalIndex = createdObjects.findIndex((x) => x.uid === uid);
        if (globalIndex <= -1) {
            return;
        }

        createdObjects[globalIndex].pos = pos;
        if (!createdObjects[globalIndex].createdObject) {
            return;
        }

        createdObjects[globalIndex].createdObject.pos = new alt.Vector3(pos);
    },
    populate(newObjects: Array<IObject>) {
        // First Loop Clears Uncommon Values
        for (let i = createdObjects.length - 1; i >= 0; i--) {
            if (newObjects.findIndex((x) => x.uid === createdObjects[i].uid) >= 0) {
                continue;
            }

            if (createdObjects[i].createdObject) {
                createdObjects[i].createdObject.destroy();
            }

            createdObjects.splice(i, 1);
        }

        // Second loop pushes objects that do not exist and creates objects that have not been created
        for (let i = 0; i < newObjects.length; i++) {
            let existingIndex = createdObjects.findIndex((x) => x.uid === newObjects[i].uid);
            if (existingIndex <= -1) {
                createdObjects.push(newObjects[i]);
                existingIndex = createdObjects.length - 1;
            }

            if (createdObjects[existingIndex].createdObject) {
                // Used for updating the p osition if non-matching
                const { x, y } = createdObjects[existingIndex].createdObject.pos;
                const doesXMatch = Math.floor(x) === Math.floor(newObjects[i].pos.x);
                const doesYMatch = Math.floor(y) === Math.floor(newObjects[i].pos.y);

                if (doesXMatch && doesYMatch) {
                    continue;
                }

                createdObjects[existingIndex].pos = new alt.Vector3(newObjects[i].pos);
                createdObjects[existingIndex].createdObject.pos = new alt.Vector3(newObjects[i].pos);
                continue;
            }

            createdObjects[existingIndex].createdObject = new alt.Object(
                createdObjects[existingIndex].model,
                new alt.Vector3(createdObjects[existingIndex].pos),
                new alt.Vector3(0, 0, 0),
                true,
                false,
            );

            if (createdObjects[existingIndex].noCollision) {
                createdObjects[existingIndex].createdObject.toggleCollision(false, false);
            }

            createdObjects[existingIndex].createdObject.setPositionFrozen(true);
        }
    },
};

alt.on('connectionComplete', InternalFunctions.init);
alt.on('disconnect', InternalFunctions.stop);
alt.onServer(SYSTEM_EVENTS.POPULATE_OBJECTS, InternalFunctions.populate);
alt.onServer(SYSTEM_EVENTS.APPEND_OBJECT, InternalFunctions.addObject);
alt.onServer(SYSTEM_EVENTS.REMOVE_OBJECT, InternalFunctions.removeObject);
alt.onServer(SYSTEM_EVENTS.MOVE_OBJECT, InternalFunctions.moveObject);
