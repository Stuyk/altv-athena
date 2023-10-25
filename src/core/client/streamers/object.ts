import * as alt from 'alt-client';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { IObject } from '@AthenaShared/interfaces/iObject.js';

export type CreatedObject = IObject & { createdObject?: alt.LocalObject | alt.Object };

const clientObjects: { [uid: string]: CreatedObject } = {};
const serverObjects: { [uid: string]: CreatedObject } = {};

let interval: number;

/**
 * Do Not Export Internal Only
 */
const InternalFunctions = {
    stop() {
        if (!interval) {
            return;
        }

        alt.clearInterval(interval);
    },
    moveObject(uid: string, pos: alt.IVector3) {
        const dataRef = serverObjects[uid] ? serverObjects : clientObjects;
        if (!dataRef[uid]) {
            return;
        }

        dataRef[uid].pos = pos;
        if (!dataRef[uid].createdObject || !dataRef[uid].createdObject.valid) {
            return;
        }

        dataRef[uid].createdObject.pos = new alt.Vector3(pos);
    },
    updateObjectModel(uid: string, model: string) {
        const dataRef = serverObjects[uid] ? serverObjects : clientObjects;
        if (!dataRef[uid]) {
            return;
        }

        dataRef[uid].model = model;

        if (dataRef[uid].createdObject && dataRef[uid].createdObject.valid) {
            dataRef[uid].createdObject.destroy();
        }

        const createdObject = new alt.LocalObject(
            model,
            new alt.Vector3(dataRef[uid].pos),
            new alt.Vector3(dataRef[uid].rot),
            true,
            false,
        );

        if (dataRef[uid].noCollision) {
            createdObject.toggleCollision(false, false);
        }

        createdObject.positionFrozen = true;
        dataRef[uid].createdObject = createdObject;
    },
    populate(newObjects: Array<IObject>) {
        const currentUids: string[] = [];

        // Go through new objects, and create objects that may not have objects yet.
        for (let objRef of newObjects) {
            currentUids.push(objRef.uid);

            // If uid exists, and object has been created. Move on.
            if (
                serverObjects[objRef.uid] &&
                serverObjects[objRef.uid].createdObject &&
                serverObjects[objRef.uid].createdObject.valid
            ) {
                // Just update object position, even if it hasn't moved.
                serverObjects[objRef.uid].pos = objRef.pos;
                serverObjects[objRef.uid].createdObject.pos = new alt.Vector3(objRef.pos);
                serverObjects[objRef.uid].createdObject.rot = new alt.Vector3(objRef.rot);

                if (serverObjects[objRef.uid].model === objRef.model) {
                    continue;
                }

                serverObjects[objRef.uid].createdObject.destroy();
                delete serverObjects[objRef.uid];
            }

            const createdObject = new alt.LocalObject(
                objRef.model,
                new alt.Vector3(objRef.pos),
                new alt.Vector3(objRef.rot),
                true,
                false,
            );

            if (objRef.noCollision) {
                createdObject.toggleCollision(false, false);
            }

            createdObject.positionFrozen = true;

            serverObjects[objRef.uid] = {
                ...objRef,
                createdObject,
            };
        }

        // Go through all spawned objects
        // Use the uid list above, and check if an entry exists that should not
        // Remove all entries which are not in the current list
        const keyList = Object.keys(serverObjects);
        for (let key of keyList) {
            const index = currentUids.findIndex((x) => x === key);
            if (index >= 0) {
                continue;
            }

            if (!serverObjects[key]) {
                continue;
            }

            if (serverObjects[key].createdObject && serverObjects[key].createdObject.valid) {
                serverObjects[key].createdObject.destroy();
            }

            delete serverObjects[key];
        }
    },
};

export function addObject(newObject: IObject) {
    if (clientObjects[newObject.uid]) {
        throw new Error(`Object with ${newObject.uid} already exists! Use a unique identifier.`);
    }

    const createdObject = new alt.LocalObject(
        newObject.model,
        new alt.Vector3(newObject.pos),
        new alt.Vector3(newObject.rot),
        true,
        false,
    );

    if (newObject.noCollision) {
        createdObject.toggleCollision(false, false);
    }

    createdObject.positionFrozen = true;
    clientObjects[newObject.uid] = {
        ...newObject,
        createdObject,
    };
}

export function removeObject(uid: string) {
    if (!clientObjects[uid]) {
        return;
    }

    if (clientObjects[uid].createdObject) {
        clientObjects[uid].createdObject.destroy();
    }

    delete clientObjects[uid];
}

/**
 * Used to obtain a CreatedObject instance from a generic scriptID
 *
 *
 * @param {number} scriptId
 * @return {CreatedObject}
 */
export function getFromScriptId(scriptId: number): CreatedObject | undefined {
    const serverKeys = Object.keys(serverObjects);
    for (let key of serverKeys) {
        if (!serverObjects[key]) {
            continue;
        }

        if (!serverObjects[key].createdObject) {
            continue;
        }

        if (serverObjects[key].createdObject.scriptID !== scriptId) {
            continue;
        }

        return serverObjects[key];
    }

    const clientKeys = Object.keys(clientObjects);
    for (let key of clientKeys) {
        if (!clientObjects[key]) {
            continue;
        }

        if (!clientObjects[key].createdObject) {
            continue;
        }

        if (clientObjects[key].createdObject.scriptID !== scriptId) {
            continue;
        }

        return clientObjects[key];
    }

    return undefined;
}

alt.on('disconnect', InternalFunctions.stop);
alt.onServer(SYSTEM_EVENTS.MOVE_OBJECT, InternalFunctions.moveObject);
alt.onServer(SYSTEM_EVENTS.APPEND_OBJECT, addObject);
alt.onServer(SYSTEM_EVENTS.REMOVE_OBJECT, removeObject);
alt.onServer(SYSTEM_EVENTS.UPDATE_OBJECT_MODEL, InternalFunctions.updateObjectModel);
