import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { IObject } from '@AthenaShared/interfaces/iObject';
import { sha256Random } from '@AthenaServer/utility/encryption';
import { StreamerService } from '@AthenaServer/systems/streamer';

const globalObjects: Array<IObject> = [];
const KEY = 'objects';

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
const InternalController = {
    /**
     * Initialize the Object Controller Streamer
     * @static
     * @memberof ObjectController
     */
    init() {
        StreamerService.registerCallback(KEY, InternalController.update);
    },

    /**
     * Internal function to refresh all global objects in the streamer service.
     * @static
     * @memberof ObjectController
     */
    refresh() {
        StreamerService.updateData(KEY, globalObjects);
    },

    /**
     * Updates objects through the streamer service.
     * @static
     * @param {alt.Player} player
     * @param {Array<IObject>} objects
     * @memberof ObjectController
     */
    update(player: alt.Player, objects: Array<IObject>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_OBJECTS, objects);
    },
};

const ServerObjectControllerConst = {
    /**
     * Add an object to the global stream.
     * @static
     * @param {IObject} objectData
     * @return {string} uid for object
     * @memberof ObjectController
     */
    append(objectData: IObject): string {
        if (!objectData.uid) {
            objectData.uid = sha256Random(JSON.stringify(objectData));
        }

        globalObjects.push(objectData);
        InternalController.refresh();
        return objectData.uid;
    },

    /**
     * Remove an object from the global stream.
     * @static
     * @param {string} uid
     * @return {boolean}
     * @memberof ObjectController
     */
    remove(uid: string): boolean {
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
    },

    /**
     * Remove an object from the player that only they can see.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @param {boolean} isInterior Remove all objects that are interior based.
     * @memberof ObjectController
     */
    removeFromPlayer(player: alt.Player, uid: string, removeAllInterior = false) {
        if (!uid) {
            throw new Error(`Did not specify a uid for object removal. ObjectController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_OBJECT, uid, removeAllInterior);
    },

    /**
     * Add an object to the player that only they can see.
     * @static
     * @param {alt.Player} player
     * @param {IObject} objectData
     * @returns {string} uid for object
     * @memberof ObjectController
     */
    addToPlayer(player: alt.Player, objectData: IObject): string {
        if (!objectData.uid) {
            objectData.uid = sha256Random(JSON.stringify(objectData));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_OBJECT, objectData);
        return objectData.uid;
    },

    /**
     * Updates the position for an object.
     * NOT ALL OBJECTS CAN BE MOVED DYNAMICALLY.
     *
     * @static
     * @param {string} uid
     * @param {alt.IVector3} pos
     * @param {alt.Player} [player=undefined]
     * @memberof ServerObjectController
     */
    updatePosition(uid: string, pos: alt.IVector3, player: alt.Player = undefined): boolean {
        if (typeof player === 'undefined') {
            const index = globalObjects.findIndex((x) => x.uid === uid);
            if (index === -1) {
                return false;
            }

            globalObjects[index].pos = pos;
            InternalController.refresh();
            return true;
        }

        alt.emitClient(player, SYSTEM_EVENTS.UPDATE_OBJECT, { uid, pos });
        return true;
    },
};

export const ServerObjectController = {
    ...ServerObjectControllerConst,
};

InternalController.init();
