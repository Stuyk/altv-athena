import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IObject } from '../../shared/interfaces/IObject';
import Logger from '../utility/athenaLogger';

const globalObjects: Array<IObject> = [];
let appendDataFinishTime = Date.now() + 5000;

export class ObjectController {
    /**
     * Adds a global label the player loads when they join.
     * @static
     * @param {Marker} marker
     * @memberof MarkerController
     */
    static add(marker: IObject) {
        appendDataFinishTime = Date.now() + 500;
        globalObjects.push(marker);
    }

    /**
     * Adds a global object for the player.
     * Streamed in when they're in range.
     * @static
     * @param {IObject} objectData
     * @memberof MarkerController
     */
    static append(objectData: IObject) {
        if (!objectData.uid) {
            Logger.error(`(${JSON.stringify(objectData.pos)}) Object does not have a unique id (uid).`);
            return;
        }

        ObjectController.add(objectData);
    }

    /**
     * Removes a text label based on uid.
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof TextLabelController
     */
    static remove(uid: string): boolean {
        const index = globalObjects.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        alt.emitClient(null, SYSTEM_EVENTS.REMOVE_MARKER, uid);
        globalObjects.splice(index, 1);
        return true;
    }

    static get(): Promise<Array<IObject>> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (Date.now() < appendDataFinishTime) {
                    return;
                }

                alt.clearInterval(interval);
                resolve(globalObjects);
            }, 100);
        });
    }

    /**
     * Updates marker labels through the streamer service.
     * @static
     * @param {alt.Player} player
     * @param {Array<Marker>} markers
     * @memberof MarkerController
     */
    static update(player: alt.Player, markers: Array<IObject>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_OBJECTS, markers);
    }
}
