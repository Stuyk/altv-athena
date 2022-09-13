import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IObject } from '../../shared/interfaces/iObject';
import { sha256Random } from '../utility/encryption';
import { StreamerService } from '../systems/streamer';

const globalObjects: Array<IObject> = [];
const KEY = 'objects';

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
class InternalController {
    /**
     * Initialize the Object Controller Streamer
     * @static
     * @memberof ObjectController
     */
    static init() {
        StreamerService.registerCallback(KEY, InternalController.update);
    }

    /**
     * Internal function to refresh all global objects in the streamer service.
     * @static
     * @memberof ObjectController
     */
    static refresh() {
        StreamerService.updateData(KEY, globalObjects);
    }

    /**
     * Updates objects through the streamer service.
     * @static
     * @param {alt.Player} player
     * @param {Array<IObject>} objects
     * @memberof ObjectController
     */
    static update(player: alt.Player, objects: Array<IObject>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_OBJECTS, objects);
    }
}

export class ServerObjectController {
    /**
     * Add an object to the global stream.
     * @static
     * @param {IObject} objectData
     * @return {string} uid for object
     * @memberof ObjectController
     */
    static append(objectData: IObject): string {
        if (!objectData.uid) {
            objectData.uid = sha256Random(JSON.stringify(objectData));
        }

        globalObjects.push(objectData);
        InternalController.refresh();
        return objectData.uid;
    }

    /**
     * Remove an object from the global stream.
     * @static
     * @param {string} uid
     * @return {boolean}
     * @memberof ObjectController
     */
    static remove(uid: string): boolean {
        let wasFound = false;
        for (let i = globalObjects.length - 1; i >= 0; i--) {
            if (globalObjects[i].uid !== uid) {
                continue;
            }

            globalObjects.splice(i, 1);
            wasFound = true;
        }

        if (!wasFound) {
            return false;
        }

        InternalController.refresh();
        alt.emitAllClients(SYSTEM_EVENTS.REMOVE_GLOBAL_OBJECT, uid);
        return true;
    }

    /**
     * Remove an object from the player that only they can see.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @param {boolean} isInterior Remove all objects that are interior based.
     * @memberof ObjectController
     */
    static removeFromPlayer(player: alt.Player, uid: string, removeAllInterior = false) {
        if (!uid) {
            throw new Error(`Did not specify a uid for object removal. ObjectController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_OBJECT, uid, removeAllInterior);
    }

    /**
     * Add an object to the player that only they can see.
     * @static
     * @param {alt.Player} player
     * @param {IObject} objectData
     * @returns {string} uid for object
     * @memberof ObjectController
     */
    static addToPlayer(player: alt.Player, objectData: IObject): string {
        if (!objectData.uid) {
            objectData.uid = sha256Random(JSON.stringify(objectData));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_OBJECT, objectData);
        return objectData.uid;
    }
}

InternalController.init();
