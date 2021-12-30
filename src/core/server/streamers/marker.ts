import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/marker';
import { sha256Random } from '../utility/encryption';
import { StreamerService } from '../systems/streamer';

const KEY = 'markers';
const globalMarkers: Array<Marker> = [];

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
class InternalController {
    /**
     * Initialize this Marker Stream Service
     * @static
     * @memberof ServerMarkerController
     */
    static init() {
        StreamerService.registerCallback(KEY, InternalController.update);
    }

    /**
     * Internal function to refresh all global markers in the streamer service.
     * @static
     * @memberof ServerMarkerController
     */
    static refresh() {
        StreamerService.updateData(KEY, globalMarkers);
    }

    /**
     * Updates marker labels through the streamer service.
     * @static
     * @param {alt.Player} player
     * @param {Array<Marker>} markers
     * @memberof ServerMarkerController
     */
    static update(player: alt.Player, markers: Array<Marker>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_MARKERS, markers);
    }
}

export class ServerMarkerController {
    /**
     * Adds a global marker for all players.
     * @static
     * @param {Marker} marker
     * @returns {string} uid for marker
     * @memberof ServerMarkerController
     */
    static append(marker: Marker): string {
        if (!marker.uid) {
            marker.uid = sha256Random(JSON.stringify(marker));
        }

        globalMarkers.push(marker);
        InternalController.refresh();
        return marker.uid;
    }

    /**
     * Removes a global marker from all players based on the global uid.
     * @static
     * @param {string} uid
     * @return {boolean}
     * @memberof ServerMarkerController
     */
    static remove(uid: string): boolean {
        const index = globalMarkers.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalMarkers.splice(index, 1);
        InternalController.refresh();
        return true;
    }

    /**
     * Remove a marker from a single local player.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof ServerMarkerController
     */
    static removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(`Did not specify a uid for marker removal. ServerMarkerController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_MARKER, uid);
    }

    /**
     * Add a marker to a single local player.
     * @static
     * @param {alt.Player} player
     * @param {Marker} marker
     * @returns {string} uid for marker
     * @memberof ServerMarkerController
     */
    static addToPlayer(player: alt.Player, marker: Marker): string {
        if (!marker.uid) {
            marker.uid = sha256Random(JSON.stringify(marker));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_MARKER, marker);
        return marker.uid;
    }
}

InternalController.init();
