import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IObject } from '../../shared/interfaces/IObject';
import { distance2d } from '../../shared/utility/vector';
import { loadModel } from '../utility/model';
import { Timer } from '../utility/timers';

let addedObjects: Array<IObject> = [];
let isRemoving = false;
let interval;

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

        addedObjects.push(objectData);

        if (!interval) {
            interval = Timer.createInterval(handleDrawObjects, 500, 'object.ts');
        }
    }

    /**
     * Used to populate server-side markers.
     * @static
     * @param {Array<IObject>} objects
     * @memberof MarkerController
     */
    static populate(objects: Array<IObject>) {
        addedObjects = objects;

        if (!interval) {
            interval = Timer.createInterval(handleDrawObjects, 500, 'object.ts');
        }
    }

    /**
     * Remove a marker from being drawn.
     * @static
     * @param {string} uid
     * @return {*}
     * @memberof MarkerController
     */
    static remove(uid: string) {
        isRemoving = true;

        const index = addedObjects.findIndex((object) => object.uid === uid);
        if (index <= -1) {
            isRemoving = false;
            return;
        }

        const objectData = addedObjects[index];
        if (!objectData) {
            isRemoving = false;
            return;
        }

        addedObjects.splice(index, 1);
        isRemoving = false;
    }
}

function handleDrawObjects() {
    if (isRemoving) {
        return;
    }

    if (addedObjects.length <= 0) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isDead) {
        return;
    }

    for (let i = 0; i < addedObjects.length; i++) {
        const objectData = addedObjects[i];
        if (!objectData.maxDistance) {
            objectData.maxDistance = 50;
        }

        // Remove the Object if it has an id
        if (distance2d(alt.Player.local.pos, objectData.pos) > objectData.maxDistance) {
            if (objectData.local !== undefined && objectData.local !== null) {
                native.deleteObject(objectData.local);
                objectData.local = null;
            }
            continue;
        }

        // Continue on. The object was already created.
        if (objectData.local !== null && objectData.local !== undefined) {
            continue;
        }

        if (objectData.isBeingCreated) {
            continue;
        }

        objectData.isBeingCreated = true;

        const hash = alt.hash(objectData.model);
        loadModel(hash).then((res) => {
            if (!res) {
                objectData.isBeingCreated = false;
                return;
            }

            objectData.local = native.createObjectNoOffset(
                hash,
                objectData.pos.x,
                objectData.pos.y,
                objectData.pos.z,
                false,
                false,
                false
            );

            native.freezeEntityPosition(objectData.local, true);
            objectData.isBeingCreated = false;
        });
    }
}

alt.onServer(SYSTEM_EVENTS.POPULATE_OBJECTS, ObjectController.populate);
alt.onServer(SYSTEM_EVENTS.REMOVE_OBJECT, ObjectController.remove);
