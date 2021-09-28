import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/Marker';
import { sha256Random } from '../utility/encryption';
import { StreamerService } from './streamer';

const KEY = 'markers';
const globalMarkers: Array<Marker> = [];

export class MarkerController {
    /**
     * Initialize this Marker Stream Service
     * @static
     * @memberof MarkerController
     */
    static init() {
        StreamerService.registerCallback(KEY, MarkerController.update);
    }

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
     * @returns {string} uid for marker
     * @memberof MarkerController
     */
    static append(marker: Marker): string {
        if (!marker.uid) {
            marker.uid = sha256Random(JSON.stringify(marker));
        }

        globalMarkers.push(marker);
        MarkerController.refresh();
        return marker.uid;
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
     * @returns {string} uid for marker
     * @memberof MarkerController
     */
    static addToPlayer(player: alt.Player, marker: Marker): string {
        if (!marker.uid) {
            marker.uid = sha256Random(JSON.stringify(marker));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_MARKER, marker);
        return marker.uid;
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

MarkerController.init();
