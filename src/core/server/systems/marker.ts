import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/Marker';

const globalMarkers: Array<Marker> = [];

export class MarkerController {
    static add(marker: Marker) {
        globalMarkers.push(marker);
    }

    static populateGlobalMarkers(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_MARKERS, globalMarkers);
    }
}
