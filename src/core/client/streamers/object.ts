import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { IObject } from '../../shared/interfaces/IObject';
import { distance2d } from '../../shared/utility/vector';
import { loadModel } from '../utility/model';
import { Timer } from '../utility/timers';

let localObjects: Array<IObject> = [];
let addedObjects: Array<IObject> = [];
let objectInfo: { [uid: string]: number } = {};
let isRemoving = false;
let interval;

export class ClientObjectController {
    static init() {
        localObjects = [];
        addedObjects = [];
    }

    /**
     * Add a single marker.
     * @static
     * @param {IObject} objectData
     * @memberof ClientObjectController
     */
    static append(objectData: IObject) {
        if (!objectData.uid) {
            alt.logError(`(${JSON.stringify(objectData.pos)}) Object is missing uid.`);
            return;
        }

        const index = localObjects.findIndex((obj) => obj.uid === objectData.uid);
        if (index <= -1) {
            localObjects.push(objectData);
        } else {
            alt.logWarning(`${objectData.uid} was not a unique identifier. Replaced Object in ClientObjectController.`);
            localObjects[index] = objectData;
        }

        if (!interval) {
            interval = Timer.createInterval(handleDrawObjects, 500, 'object.ts');
        }
    }

    /**
     * Used to populate server-side markers.
     * @static
     * @param {Array<IObject>} objects
     * @memberof ClientObjectController
     */
    static populate(objects: Array<IObject>) {
        addedObjects = objects;

        if (!interval) {
            interval = Timer.createInterval(handleDrawObjects, 500, 'object.ts');
        }
    }

    static stop() {
        isRemoving = true;
        const objects = addedObjects.concat(localObjects);
        for (let i = 0; i < objects.length; i++) {
            ClientObjectController.remove(objects[i].uid);
        }

        if (!interval) {
            return;
        }

        Timer.clearInterval(interval);
    }

    /**
     * Remove a object from being drawn.
     * @static
     * @param {string} uid
     * @return {*}
     * @memberof ClientObjectController
     */
    static remove(uid: string, removeAllInterior = false) {
        isRemoving = true;

        let index = -1;

        if (objectInfo[uid] !== null && objectInfo[uid] !== undefined) {
            native.deleteEntity(objectInfo[uid]);
            delete objectInfo[uid];
        }

        // Removes all objects matching this prefix specifically.
        if (removeAllInterior) {
            for (let i = localObjects.length - 1; i >= 0; i--) {
                if (!localObjects[i].isInterior) {
                    continue;
                }

                localObjects.splice(i, 1);
            }

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
     * @memberof ClientObjectController
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
}

function handleDrawObjects() {
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
                false,
            );

            // alt.log(`CREATED MODEL ${objectInfo[objectData.uid]} for ${objectData.model}`);
            const rot = objectData.rot ? objectData.rot : { x: 0, y: 0, z: 0 };
            native.setEntityRotation(objectInfo[objectData.uid], rot.x, rot.y, rot.z, 1, false);
            native.freezeEntityPosition(objectInfo[objectData.uid], true);

            if (objectData.noCollision) {
                native.setEntityCollision(objectInfo[objectData.uid], false, true);
            }
        });
    }
}

alt.on('connectionComplete', ClientObjectController.init);
alt.on('disconnect', ClientObjectController.stop);
alt.onServer(SYSTEM_EVENTS.REMOVE_GLOBAL_OBJECT, ClientObjectController.removeGlobalObject);
alt.onServer(SYSTEM_EVENTS.APPEND_OBJECT, ClientObjectController.append);
alt.onServer(SYSTEM_EVENTS.POPULATE_OBJECTS, ClientObjectController.populate);
alt.onServer(SYSTEM_EVENTS.REMOVE_OBJECT, ClientObjectController.remove);
