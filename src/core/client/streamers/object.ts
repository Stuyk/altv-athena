import * as alt from 'alt-client';
import * as native from 'natives';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { IObject } from '@AthenaShared/interfaces/iObject';
import { distance2d } from '@AthenaShared/utility/vector';
import { loadModel } from '@AthenaClient/utility/model';
import { Timer } from '@AthenaClient/utility/timers';

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
const ClientObjectController = {
    init() {
        alt.on('disconnect', ClientObjectController.stop);
        alt.onServer(SYSTEM_EVENTS.REMOVE_GLOBAL_OBJECT, ClientObjectController.removeGlobalObject);
        alt.onServer(SYSTEM_EVENTS.APPEND_OBJECT, ClientObjectController.append);
        alt.onServer(SYSTEM_EVENTS.POPULATE_OBJECTS, ClientObjectController.populate);
        alt.onServer(SYSTEM_EVENTS.REMOVE_OBJECT, ClientObjectController.removeLocalObject);
        alt.onServer(SYSTEM_EVENTS.UPDATE_OBJECT, ClientObjectController.update);
        localObjects = [];
        globalObjects = [];
    },

    /**
     * Updates an object's position if it exists.
     *
     * @param {IObject} objectData
     */
    update(objectData: IObject) {
        const index = localObjects.findIndex((obj) => obj.uid === objectData.uid);
        if (index <= -1) {
            return;
        }

        localObjects[index] = { ...localObjects[index], ...objectData };
    },

    /**
     * Add a single marker.
     * @static
     * @param {IObject} objectData
     * @memberof ClientObjectController
     */
    append(objectData: IObject) {
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
    },

    /**
     * Used to populate server-side markers.
     * @static
     * @param {Array<IObject>} objects
     * @memberof ClientObjectController
     */
    populate(objects: Array<IObject>) {
        globalObjects = objects;

        if (!interval) {
            interval = Timer.createInterval(ClientObjectController.handleDrawObjects, 100, 'object.ts');
        }
    },

    async stop() {
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
    },

    /**
     * Remove a object from being drawn.
     * @static
     * @param {string} uid
     * @return {*}
     * @memberof ClientObjectController
     */
    async removeLocalObject(uid: string, removeAllInterior = false) {
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
    },

    /**
     * Force remove a global object if present.
     * @static
     * @param {string} uid
     * @memberof ClientObjectController
     */
    async removeGlobalObject(uid: string) {
        isRemoving = true;

        for (let i = globalObjects.length - 1; i >= 0; i--) {
            if (globalObjects[i].uid !== uid) {
                continue;
            }

            await ClientObjectController.removeObject(globalObjects[i]);
            globalObjects.splice(i, 1);
        }

        isRemoving = false;
    },

    /**
     * Verify if an object already exists.
     *
     * @static
     * @param {string} uid
     * @return {boolean}
     * @memberof ClientObjectController
     */
    doesObjectExist(uid: string): boolean {
        return createdObjects.findIndex((obj) => obj.uid === uid && native.doesEntityExist(obj.id)) >= 0;
    },
    /**
     * Update object position if it needs to be updated.
     *
     * @param {string} uid
     * @return {*}
     */
    updateObjectPosition(uid: string, pos: alt.IVector3) {
        const createdIndex = createdObjects.findIndex((obj) => obj.uid === uid && native.doesEntityExist(obj.id));
        if (createdIndex <= -1) {
            return;
        }

        if (!native.doesEntityExist(createdObjects[createdIndex].id)) {
            return;
        }

        createdObjects[createdIndex].pos = pos;
        native.setEntityCoordsNoOffset(createdObjects[createdIndex].id, pos.x, pos.y, pos.z, false, false, false);
    },

    /**
     * Create an object if it does not exist.
     *
     * @static
     * @param {IObject} object
     * @memberof ClientObjectController
     */
    async createObject(object: IObject) {
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
    },

    /**
     * Remove an object if it exists.
     *
     * @static
     * @param {IObject} object
     * @memberof ClientObjectController
     */
    async removeObject(object: IObject) {
        isRemoving = true;

        for (let i = createdObjects.length - 1; i >= 0; i--) {
            if (createdObjects[i].uid !== object.uid) {
                continue;
            }

            while (native.doesEntityExist(createdObjects[i].id)) {
                native.setEntityAsMissionEntity(createdObjects[i].id, true, true);
                native.deleteEntity(createdObjects[i].id);
                native.deleteObject(createdObjects[i].id);
                native.setEntityAsNoLongerNeeded(createdObjects[i].id);
                native.clearAreaOfObjects(
                    createdObjects[i].pos.x,
                    createdObjects[i].pos.y,
                    createdObjects[i].pos.z,
                    0.1,
                    0,
                );
            }

            createdObjects.splice(i, 1);
        }

        isRemoving = false;
    },

    async handleDrawObjects() {
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
                ClientObjectController.updateObjectPosition(data.uid, data.pos);
                continue;
            }

            await ClientObjectController.createObject(data);
        }
    },
};

alt.on('connectionComplete', ClientObjectController.init);
