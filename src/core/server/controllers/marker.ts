import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/marker';
import { sha256Random } from '../utility/hash';

const KEY = 'markers';
const globalMarkers: Array<Marker> = [];

const InternalController = {
    /**
     * Initialize this Marker Stream Service
     * @memberof ServerMarkerController
     */
    init() {
        Athena.systems.streamer.registerCallback(KEY, InternalController.update);
    },

    /**
     * Internal function to refresh all global markers in the streamer service.
     * @memberof ServerMarkerController
     */
    refresh() {
        Athena.systems.streamer.updateData(KEY, globalMarkers);
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

/**
 * Adds a global marker for all players.
 *
 * - [See alt:V Marker List](https://docs.altv.mp/gta/articles/references/markers.html)
 *
 * @example
 * ```ts
 * const uid = Athena.controllers.marker.append({
 *      type: 1,
 *      color: new alt.RGBA(0, 255, 0, 100),
 *      pos: { x: 0, y: 0, z: 0}
 * });
 * ```
 *
 * @param {Marker} marker
 * @returns {string} uid for marker
 */
export function append(marker: Marker): string {
    if (!marker.uid) {
        marker.uid = sha256Random(JSON.stringify(marker));
    }

    globalMarkers.push(marker);
    InternalController.refresh();
    return marker.uid;
}

/**
 * Removes a global marker from all players based on the global uid.
 *
 * @example
 * ```ts
 * Athena.controllers.marker.remove(someUid);
 * ```
 *
 * @param {string} uid
 * @return {boolean}
 */
export function remove(uid: string): boolean {
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
 *
 * @example
 * ```ts
 * Athena.controllers.marker.remove(somePlayer, someUid);
 * ```
 *
 * @param {alt.Player} player
 * @param {string} uid
 */
export function removeFromPlayer(player: alt.Player, uid: string) {
    if (!uid) {
        throw new Error(`Did not specify a uid for marker removal. ServerMarkerController.removeFromPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.REMOVE_MARKER, uid);
}

/**
 * Add a marker to a single local player.
 *
 * @example
 * ```ts
 * Athena.controllers.marker.addToPlayer(somePlayer, {
 *      type: 1,
 *      color: new alt.RGBA(0, 255, 0, 100),
 *      pos: { x: 0, y: 0, z: 0}
 * });
 * ```
 *
 * @param {alt.Player} player
 * @param {Marker} marker
 * @returns {string} uid for marker
 */
export function addToPlayer(player: alt.Player, marker: Marker): string {
    if (!marker.uid) {
        marker.uid = sha256Random(JSON.stringify(marker));
    }

    alt.emitClient(player, SYSTEM_EVENTS.APPEND_MARKER, marker);
    return marker.uid;
}

InternalController.init();

type MarkerControllerFuncs = ControllerFuncs<typeof append, typeof remove, typeof addToPlayer, typeof removeFromPlayer>;

const Overrides: Partial<MarkerControllerFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'addToPlayer', callback: typeof addToPlayer);
export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer);
/**
 * Used to override any marker streamer functionality
 *
 * @export
 * @param {keyof MarkerControllerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof MarkerControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
