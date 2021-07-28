import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/Marker';
import Logger from '../utility/athenaLogger';
import { StreamerService } from './streamer';

const KEY = 'markers';
const globalMarkers: Array<Marker> = [];

export class MarkerController {
    /**
     * Internal function to refresh all global markers in the streamer service.
     * @static
     * @memberof MarkerController
     */
    static refresh() {
        StreamerService.updateData(KEY, globalMarkers);
    }

    /**
     * Adds a global marker for all players.
     * @static
     * @param {Marker} marker
     * @memberof MarkerController
     */
    static append(marker: Marker) {
        if (!marker.uid) {
            Logger.error(`(${JSON.stringify(marker.pos)}) Marker does not have a unique id (uid).`);
            return;
        }

        globalMarkers.push(marker);
        MarkerController.refresh();
    }

    /**
     * Removes a global marker from all players based on the global uid.
     * @static
     * @param {string} uid
     * @return {boolean}
     * @memberof MarkerController
     */
    static remove(uid: string): boolean {
        const index = globalMarkers.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalMarkers.splice(index, 1);
        MarkerController.refresh();
        return true;
    }

    /**
     * Remove a marker from a single local player.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof MarkerController
     */
    static removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(`Did not specify a uid for marker removal. MarkerController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_MARKER, uid);
    }

    /**
     * Add a marker to a single local player.
     * @static
     * @param {alt.Player} player
     * @param {Marker} marker
     * @memberof MarkerController
     */
    static addToPlayer(player: alt.Player, marker: Marker) {
        if (!marker.uid) {
            throw new Error(`Marker ${JSON.stringify(marker.pos)} does not have a uid. MarkerController.addToPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_MARKER, marker);
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
}
