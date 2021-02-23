import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { TextLabel } from '../../shared/interfaces/TextLabel';
import { distance2d } from '../../shared/utility/vector';
import { drawText3D } from '../utility/text';

alt.onServer(SYSTEM_EVENTS.POPULATE_MARKERS, handleAddTextLabels);

let addedLabels: Array<TextLabel> = [];
let interval;

function handleAddTextLabels(textlabels: Array<TextLabel>) {
    addedLabels = addedLabels.concat(textlabels);

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

    for (let i = 0; i < addedLabels.length; i++) {
        const label = addedLabels[i];
        if (!label.maxDistance) {
            label.maxDistance = 15;
        }

        if (distance2d(alt.Player.local.pos, label.pos) > label.maxDistance) {
            continue;
        }

        drawText3D(label.data, label.pos, 0.4, new alt.RGBA(255, 255, 255, 255));
    }
}
