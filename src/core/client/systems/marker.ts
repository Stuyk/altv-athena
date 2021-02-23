import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/Marker';
import { distance2d } from '../../shared/utility/vector';
import { drawMarker } from '../utility/marker';

alt.onServer(SYSTEM_EVENTS.POPULATE_MARKERS, handleAddMarkers);

let addedMarkers: Array<Marker> = [];
let interval;

function handleAddMarkers(markers: Array<Marker>) {
    addedMarkers = addedMarkers.concat(markers);

    if (!interval) {
        interval = alt.setInterval(handleDrawMarkers, 0);
    }
}

function handleDrawMarkers() {
    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isDead) {
        return;
    }

    for (let i = 0; i < addedMarkers.length; i++) {
        const marker = addedMarkers[i];
        if (!marker.maxDistance) {
            marker.maxDistance = 50;
        }

        if (distance2d(alt.Player.local.pos, marker.pos) > marker.maxDistance) {
            continue;
        }

        if (!marker.scale) {
            marker.scale = new alt.Vector3(1, 1, 1);
        }

        drawMarker(marker.type, marker.pos, marker.scale, marker.color);
    }
}
