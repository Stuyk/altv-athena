import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { TextLabel } from '../../shared/interfaces/TextLabel';
import { distance2d } from '../../shared/utility/vector';
import { drawText3D } from '../utility/text';
import { Timer } from '../utility/timers';

let localLabels: Array<TextLabel> = [];
let addedLabels: Array<TextLabel> = [];
let interval;
let isRemoving = false;

export class TextlabelController {
    /**
     * Add a single text label.
     * @static
     * @param {TextLabel} label
     * @memberof MarkerController
     */
    static append(label: TextLabel) {
        if (!label.uid) {
            alt.logError(`(${JSON.stringify(label.data)}) Label is missing uid.`);
            return;
        }

        localLabels.push(label);

        if (!interval) {
            interval = Timer.createInterval(handleDrawTextlabels, 0, 'textlabel.ts');
        }
    }

    /**
     * Used to populate server-side markers.
     * @static
     * @param {Array<Marker>} labels
     * @memberof MarkerController
     */
    static populate(labels: Array<TextLabel>) {
        addedLabels = labels;

        if (!interval) {
            interval = Timer.createInterval(handleDrawTextlabels, 0, 'textlabel.ts');
        }
    }

    /**
     * Remove a marker from being drawn.
     * @static
     * @param {string} uid
     * @return {*}
     * @memberof MarkerController
     */
    static remove(uid: string) {
        isRemoving = true;

        const index = localLabels.findIndex((marker) => marker.uid === uid);
        if (index <= -1) {
            isRemoving = false;
            return;
        }

        const label = localLabels[index];
        if (!label) {
            isRemoving = false;
            return;
        }

        localLabels.splice(index, 1);
        isRemoving = false;
    }
}

function handleDrawTextlabels() {
    if (isRemoving) {
        return;
    }

    const labels = addedLabels.concat(localLabels);

    if (labels.length <= 0) {
        return;
    }

    if (alt.Player.local.isWheelMenuOpen) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isDead) {
        return;
    }

    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (!label.maxDistance) {
            label.maxDistance = 15;
        }

        if (distance2d(alt.Player.local.pos, label.pos) > label.maxDistance) {
            continue;
        }

        drawText3D(label.data, label.pos, 0.4, new alt.RGBA(255, 255, 255, 255));
    }
}

alt.onServer(SYSTEM_EVENTS.APPEND_TEXTLABELS, TextlabelController.append);
alt.onServer(SYSTEM_EVENTS.POPULATE_TEXTLABELS, TextlabelController.populate);
alt.onServer(SYSTEM_EVENTS.REMOVE_TEXTLABEL, TextlabelController.remove);
