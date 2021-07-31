import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/Marker';
import { distance2d } from '../../shared/utility/vector';
import { drawMarker } from '../utility/marker';
import { Timer } from '../utility/timers';

let addedMarkers: Array<Marker> = [];
let localMarkers: Array<Marker> = [];
let isRemoving = false;
let interval;

export class MarkerController {
    /**
     * Add a single local marker.
     * @static
     * @param {Marker} marker
     * @memberof MarkerController
     */
    static append(marker: Marker) {
        if (!marker.uid) {
            alt.logError(`(${JSON.stringify(marker.pos)}) Marker is missing uid.`);
            return;
        }

        localMarkers.push(marker);

        if (!interval) {
            interval = Timer.createInterval(handleDrawMarkers, 0, 'marker.ts');
        }
    }

    /**
     * Used to populate server-side markers and keeps them
     * separate from local markers.
     * @static
     * @param {Array<Marker>} markers
     * @memberof MarkerController
     */
    static populate(markers: Array<Marker>) {
        addedMarkers = markers;

        if (!interval) {
            interval = Timer.createInterval(handleDrawMarkers, 0, 'marker.ts');
        }
    }

    /**
     * Remove a local marker from being drawn.
     * @static
     * @param {string} uid
     * @return {*}
     * @memberof MarkerController
     */
    static remove(uid: string) {
        isRemoving = true;

        const index = localMarkers.findIndex((marker) => marker.uid === uid);
        if (index <= -1) {
            isRemoving = false;
            return;
        }

        const marker = localMarkers[index];
        if (!marker) {
            isRemoving = false;
            return;
        }

        localMarkers.splice(index, 1);
        isRemoving = false;
    }
}

function handleDrawMarkers() {
    if (isRemoving) {
        return;
    }

    const markers = addedMarkers.concat(localMarkers);

    if (markers.length <= 0) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isDead) {
        return;
    }

    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        if (!marker.maxDistance) {
            marker.maxDistance = 25;
        }

        if (distance2d(alt.Player.local.pos, marker.pos) > marker.maxDistance) {
            continue;
        }

        if (!marker.scale) {
            marker.scale = new alt.Vector3(1, 1, 1);
        }

        drawMarker(marker.type, marker.pos, marker.scale, marker.color, marker.bobUpAndDown, marker.faceCamera);
    }
}

alt.onServer(SYSTEM_EVENTS.POPULATE_MARKERS, MarkerController.populate);
alt.onServer(SYSTEM_EVENTS.APPEND_MARKER, MarkerController.append);
alt.onServer(SYSTEM_EVENTS.REMOVE_MARKER, MarkerController.remove);
