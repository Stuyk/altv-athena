import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IObject } from '../../shared/interfaces/iObject';
import { distance2d } from '../../shared/utility/vector';
import { loadModel } from '../utility/model';
import { Timer } from '../utility/timers';

interface LocalObject extends IObject {
    id: number;
}

let localObjects: Array<IObject> = [];
let globalObjects: Array<IObject> = [];
let createdObjects: Array<LocalObject> = [];

let isRemoving = false;
let interval;

/**
 * Do Not Export Internal Only
 */
class ClientObjectController {
    static init() {
        alt.on('disconnect', ClientObjectController.stop);
        alt.onServer(SYSTEM_EVENTS.REMOVE_GLOBAL_OBJECT, ClientObjectController.removeGlobalObject);
        alt.onServer(SYSTEM_EVENTS.APPEND_OBJECT, ClientObjectController.append);
        alt.onServer(SYSTEM_EVENTS.POPULATE_OBJECTS, ClientObjectController.populate);
        alt.onServer(SYSTEM_EVENTS.REMOVE_OBJECT, ClientObjectController.removeLocalObject);
        localObjects = [];
        globalObjects = [];
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
            interval = Timer.createInterval(ClientObjectController.handleDrawObjects, 100, 'object.ts');
        }
    }

    /**
     * Used to populate server-side markers.
     * @static
     * @param {Array<IObject>} objects
     * @memberof ClientObjectController
     */
    static populate(objects: Array<IObject>) {
        globalObjects = objects;

        if (!interval) {
            interval = Timer.createInterval(ClientObjectController.handleDrawObjects, 100, 'object.ts');
        }
    }

    static async stop() {
        isRemoving = true;

        for (let i = localObjects.length - 1; i >= 0; i--) {
            await ClientObjectController.removeLocalObject(localObjects[i].uid);
        }

        for (let i = globalObjects.length - 1; i >= 0; i--) {
            await ClientObjectController.removeGlobalObject(globalObjects[i].uid);
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
    static async removeLocalObject(uid: string, removeAllInterior = false) {
        isRemoving = true;

        for (let i = localObjects.length - 1; i >= 0; i--) {
            if (
                (removeAllInterior && !localObjects[i].isInterior) ||
                (!removeAllInterior && localObjects[i].uid !== uid)
            ) {
                continue;
            }

            await ClientObjectController.removeObject(localObjects[i]);
            localObjects.splice(i, 1);
        }

        isRemoving = false;
    }

    /**
     * Force remove a global object if present.
     * @static
     * @param {string} uid
     * @memberof ClientObjectController
     */
    static async removeGlobalObject(uid: string) {
        isRemoving = true;

        for (let i = globalObjects.length - 1; i >= 0; i--) {
            if (globalObjects[i].uid !== uid) {
                continue;
            }

            await ClientObjectController.removeObject(globalObjects[i]);
            globalObjects.splice(i, 1);
        }

        isRemoving = false;
    }

    /**
     * Verify if an object already exists.
     *
     * @static
     * @param {string} uid
     * @return {boolean}
     * @memberof ClientObjectController
     */
    static doesObjectExist(uid: string): boolean {
        return createdObjects.findIndex((obj) => obj.uid === uid) >= 0;
    }

    /**
     * Create an object if it does not exist.
     *
     * @static
     * @param {IObject} object
     * @memberof ClientObjectController
     */
    static async createObject(object: IObject) {
        if (ClientObjectController.doesObjectExist(object.uid)) {
            return;
        }

        const hash = alt.hash(object.model);
        await loadModel(hash);

        const newObject: LocalObject = {
            id: native.createObjectNoOffset(hash, object.pos.x, object.pos.y, object.pos.z, false, false, false),
            ...object,
        };

        const rot = object.rot ? object.rot : { x: 0, y: 0, z: 0 };
        native.setEntityRotation(newObject.id, rot.x, rot.y, rot.z, 1, false);
        native.freezeEntityPosition(newObject.id, true);

        if (object.noCollision) {
            native.setEntityCollision(newObject.id, false, true);
        }

        createdObjects.push(newObject);
    }

    /**
     * Remove an object if it exists.
     *
     * @static
     * @param {IObject} object
     * @memberof ClientObjectController
     */
    static async removeObject(object: IObject) {
        isRemoving = true;

        for (let i = createdObjects.length - 1; i >= 0; i--) {
            if (createdObjects[i].uid !== object.uid) {
                continue;
            }

            while (native.doesEntityExist(createdObjects[i].id)) {
                native.deleteEntity(createdObjects[i].id);
                native.deleteObject(createdObjects[i].id);
            }

            createdObjects.splice(i, 1);
        }

        isRemoving = false;
    }

    private static async handleDrawObjects() {
        if (isRemoving) {
            return;
        }

        const objects = globalObjects.concat(localObjects);

        if (objects.length <= 0) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        for (let i = 0; i < objects.length; i++) {
            const data = objects[i];
            const maxDistance = data.maxDistance ? Math.abs(data.maxDistance) : 25;

            // Remove the Object if it has an id
            if (distance2d(alt.Player.local.pos, data.pos) > maxDistance) {
                ClientObjectController.removeObject(data);
                continue;
            }

            if (ClientObjectController.doesObjectExist(data.uid)) {
                continue;
            }

            await ClientObjectController.createObject(data);
        }
    }
}

alt.on('connectionComplete', ClientObjectController.init);
