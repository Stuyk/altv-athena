import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IObject } from '../../shared/interfaces/IObject';
import { distance2d } from '../../shared/utility/vector';
import { loadModel } from '../utility/model';
import { Timer } from '../utility/timers';

let localObjects: Array<IObject> = [];
let addedObjects: Array<IObject> = [];
let objectInfo: { [uid: string]: number } = {};
let isRemoving = false;
let interval;
let nextCleanupCheck = Date.now() + 5000;

export class ObjectController {
    /**
     * Add a single marker.
     * @static
     * @param {IObject} objectData
     * @memberof ObjectController
     */
    static append(objectData: IObject) {
        if (!objectData.uid) {
            alt.logError(`(${JSON.stringify(objectData.pos)}) Object is missing uid.`);
            return;
        }

        localObjects.push(objectData);
        if (!interval) {
            interval = Timer.createInterval(handleDrawObjects, 500, 'object.ts');
        }
    }

    /**
     * Used to populate server-side markers.
     * @static
     * @param {Array<IObject>} objects
     * @memberof ObjectController
     */
    static populate(objects: Array<IObject>) {
        addedObjects = objects;

        if (!interval) {
            interval = Timer.createInterval(handleDrawObjects, 500, 'object.ts');
        }
    }

    /**
     * Remove a object from being drawn.
     * @static
     * @param {string} uid
     * @return {*}
     * @memberof ObjectController
     */
    static remove(uid: string, removeAllInterior = false) {
        isRemoving = true;

        let index = -1;

        // Removes all objects matching this prefix specifically.
        if (removeAllInterior) {
            let count = 0;
            for (let i = localObjects.length - 1; i >= 0; i--) {
                if (!localObjects[i].isInterior) {
                    continue;
                }

                const actualID = localObjects[i].uid;
                localObjects.splice(i, 1);

                if (objectInfo[actualID] !== null && objectInfo[actualID] !== undefined) {
                    native.deleteEntity(objectInfo[actualID]);
                    delete objectInfo[actualID];
                    count += 1;
                }
            }

            alt.log(`Removed ${count} Spawned Objects from Local Interior Stream`);
            isRemoving = false;
            return;
        }

        index = localObjects.findIndex((object) => object.uid === uid);

        if (index <= -1) {
            isRemoving = false;
            return;
        }

        const objectData = localObjects[index];
        if (!objectData) {
            isRemoving = false;
            return;
        }

        localObjects.splice(index, 1);
        isRemoving = false;
    }

    /**
     * Force remove a global object if present.
     * @static
     * @param {string} uid
     * @memberof ObjectController
     */
    static removeGlobalObject(uid: string) {
        isRemoving = true;

        let index = addedObjects.findIndex((object) => object.uid === uid);
        if (index >= 0) {
            addedObjects.splice(index, 1);
        }

        if (objectInfo[uid] !== null && objectInfo[uid] !== undefined) {
            native.deleteEntity(objectInfo[uid]);
            delete objectInfo[uid];
        }

        isRemoving = false;
    }

    static crossCompareObjects() {
        if (isRemoving) {
            return;
        }

        isRemoving = true;

        const keys = Object.keys(objectInfo);
        if (keys.length <= 0) {
            return;
        }

        for (let i = 0; i < keys.length; i++) {
            const uid = keys[i];

            const foundLocal = localObjects.findIndex((x) => x.uid === uid);
            if (foundLocal >= 0) {
                continue;
            }

            const foundGlobal = addedObjects.findIndex((x) => x.uid === uid);
            if (foundGlobal >= 0) {
                continue;
            }

            try {
                native.deleteObject(objectInfo[uid]);
                delete objectInfo[uid];
            } catch (err) {
                //
            }
        }

        isRemoving = false;
    }
}

function handleDrawObjects() {
    if (Date.now() > nextCleanupCheck) {
        nextCleanupCheck = Date.now() + 2500;
        ObjectController.crossCompareObjects();
    }

    if (isRemoving) {
        return;
    }

    const objects = addedObjects.concat(localObjects);

    if (objects.length <= 0) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isDead) {
        return;
    }

    for (let i = 0; i < objects.length; i++) {
        const objectData = objects[i];
        if (!objectData.maxDistance) {
            objectData.maxDistance = 25;
        }

        // Remove the Object if it has an id
        if (distance2d(alt.Player.local.pos, objectData.pos) > objectData.maxDistance) {
            // Being Created. Delete it after creation.
            if (objectInfo[objectData.uid] === -1) {
                continue;
            }

            if (objectInfo[objectData.uid] !== undefined && objectInfo[objectData.uid] !== null) {
                native.deleteObject(objectInfo[objectData.uid]);
                objectInfo[objectData.uid] = null;
            }
            continue;
        }

        // Continue on. The object was already created.
        if (objectInfo[objectData.uid] !== undefined && objectInfo[objectData.uid] !== null) {
            continue;
        }

        objectInfo[objectData.uid] = -1;

        const hash = alt.hash(objectData.model);
        loadModel(hash).then((res) => {
            if (!res) {
                objectInfo[objectData.uid] = null;
                throw new Error(`${objectData.model} is not a valid model.`);
            }

            objectInfo[objectData.uid] = native.createObjectNoOffset(
                hash,
                objectData.pos.x,
                objectData.pos.y,
                objectData.pos.z,
                false,
                false,
                false
            );

            // alt.log(`CREATED MODEL ${objectInfo[objectData.uid]} for ${objectData.model}`);
            const rot = objectData.rot ? objectData.rot : { x: 0, y: 0, z: 0 };
            native.setEntityRotation(objectInfo[objectData.uid], rot.x, rot.y, rot.z, 1, false);
            native.freezeEntityPosition(objectInfo[objectData.uid], true);
        });
    }
}

alt.onServer(SYSTEM_EVENTS.REMOVE_GLOBAL_OBJECT, ObjectController.removeGlobalObject);
alt.onServer(SYSTEM_EVENTS.APPEND_OBJECT, ObjectController.append);
alt.onServer(SYSTEM_EVENTS.POPULATE_OBJECTS, ObjectController.populate);
alt.onServer(SYSTEM_EVENTS.REMOVE_OBJECT, ObjectController.remove);
