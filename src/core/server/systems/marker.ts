import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/Marker';
import Logger from '../utility/athenaLogger';

const globalMarkers: Array<Marker> = [];
let appendDataFinishTime = Date.now() + 5000;

export class MarkerController {
    /**
     * Adds a global label the player loads when they join.
     * @static
     * @param {Marker} marker
     * @memberof MarkerController
     */
    static add(marker: Marker) {
        appendDataFinishTime = Date.now() + 500;
        globalMarkers.push(marker);
    }

    /**
     * Adds a global label the player loads when they join.
     * Also appends it to any online players.
     * Requires a UID to remove it later.
     * @static
     * @param {Marker} label
     * @memberof MarkerController
     */
    static append(marker: Marker) {
        if (!marker.uid) {
            Logger.error(`(${JSON.stringify(marker.pos)}) Marker does not have a unique id (uid).`);
            return;
        }

        MarkerController.add(marker);
        alt.emitClient(null, SYSTEM_EVENTS.APPEND_MARKER, marker);
    }

    /**
     * Removes a text label based on uid.
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof TextLabelController
     */
    static remove(uid: string): boolean {
        const index = globalMarkers.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        alt.emitClient(null, SYSTEM_EVENTS.REMOVE_MARKER, uid);
        globalMarkers.splice(index, 1);
        return true;
    }

    static get(): Promise<Array<Marker>> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (Date.now() < appendDataFinishTime) {
                    return;
                }

                alt.clearInterval(interval);
                resolve(globalMarkers);
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
    static update(player: alt.Player, markers: Array<Marker>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_MARKERS, markers);
    }

    static populateGlobalMarkers(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_MARKERS, globalMarkers);
    }
}
