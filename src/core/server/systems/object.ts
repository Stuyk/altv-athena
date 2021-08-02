import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IObject } from '../../shared/interfaces/IObject';
import Logger from '../utility/athenaLogger';
import { StreamerService } from './streamer';

const globalObjects: Array<IObject> = [];
const KEY = 'objects';

export class ObjectController {
    /**
     * Internal function to refresh all global objects in the streamer service.
     * @static
     * @memberof ObjectController
     */
    static refresh() {
        StreamerService.updateData(KEY, globalObjects);
    }

    /**
     * Add an object to the global stream.
     * @static
     * @param {IObject} objectData
     * @return {*}
     * @memberof ObjectController
     */
    static append(objectData: IObject) {
        if (!objectData.uid) {
            Logger.error(`(${JSON.stringify(objectData.pos)}) Object does not have a unique id (uid).`);
            return;
        }

        globalObjects.push(objectData);
        ObjectController.refresh();
    }

    /**
     * Remove an object from the global stream.
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof ObjectController
     */
    static remove(uid: string): boolean {
        const index = globalObjects.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalObjects.splice(index, 1);
        ObjectController.refresh();
        alt.emitClient(null, SYSTEM_EVENTS.REMOVE_GLOBAL_OBJECT, uid);
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
     * @memberof ObjectController
     */
    static addToPlayer(player: alt.Player, objectData: IObject) {
        if (!objectData.uid) {
            throw new Error(
                `Object ${JSON.stringify(objectData.pos)} does not have a uid. ObjectController.addToPlayer`
            );
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_OBJECT, objectData);
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
