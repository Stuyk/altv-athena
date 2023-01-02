import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { Marker } from '@AthenaShared/interfaces/marker';
import { sha256Random } from '@AthenaServer/utility/encryption';
import { StreamerService } from '@AthenaServer/systems/streamer';

const KEY = 'markers';
const globalMarkers: Array<Marker> = [];

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
const InternalController = {
    /**
     * Initialize this Marker Stream Service
     * @memberof ServerMarkerController
     */
    init() {
        StreamerService.registerCallback(KEY, InternalController.update);
    },

    /**
     * Internal function to refresh all global markers in the streamer service.
     * @memberof ServerMarkerController
     */
    refresh() {
        StreamerService.updateData(KEY, globalMarkers);
    },

    /**
     * Updates marker labels through the streamer service.
     * @param {alt.Player} player
     * @param {Array<Marker>} markers
     * @memberof ServerMarkerController
     */
    update(player: alt.Player, markers: Array<Marker>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_MARKERS, markers);
    },
};

const ServerMarkerControllerConst = {
    /**
     * Adds a global marker for all players.
     * @param {Marker} marker
     * @returns {string} uid for marker
     * @memberof ServerMarkerController
     */
    append(marker: Marker): string {
        if (!marker.uid) {
            marker.uid = sha256Random(JSON.stringify(marker));
        }

        globalMarkers.push(marker);
        InternalController.refresh();
        return marker.uid;
    },

    /**
     * Removes a global marker from all players based on the global uid.
     * @param {string} uid
     * @return {boolean}
     * @memberof ServerMarkerController
     */
    remove(uid: string): boolean {
        const index = globalMarkers.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalMarkers.splice(index, 1);
        InternalController.refresh();
        return true;
    },

    /**
     * Remove a marker from a single local player.
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof ServerMarkerController
     */
    removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(`Did not specify a uid for marker removal. ServerMarkerController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_MARKER, uid);
    },

    /**
     * Add a marker to a single local player.
     * @param {alt.Player} player
     * @param {Marker} marker
     * @returns {string} uid for marker
     * @memberof ServerMarkerController
     */
    addToPlayer(player: alt.Player, marker: Marker): string {
        if (!marker.uid) {
            marker.uid = sha256Random(JSON.stringify(marker));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_MARKER, marker);
        return marker.uid;
    },
};

export const ServerMarkerController = {
    ...ServerMarkerControllerConst,
};

InternalController.init();
