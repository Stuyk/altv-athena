import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { TextLabel } from '@AthenaShared/interfaces/textLabel';
import { distance2d } from '@AthenaShared/utility/vector';
import { drawText3D } from '@AthenaClient/utility/text';
import { Timer } from '@AthenaClient/utility/timers';

let labels: Array<TextLabel> = [];
let interval: number;
let isRemoving = false;

/**
 * Do Not Export Internal Only
 */
const ClientTextLabelController = {
    init() {
        labels = [];
    },

    stop() {
        if (!interval) {
            return;
        }

        Timer.clearInterval(interval);
    },

    /**
     * Updates the text label for a client.
     *
     * @param {Partial<TextLabel>} label
     */
    update(label: Partial<TextLabel>) {
        const index = labels.findIndex((x) => x.uid === label.uid);
        if (index === -1) {
            return;
        }

        for (let i = labels.length - 1; i >= 0; i--) {
            if (labels[i].uid !== label.uid) {
                continue;
            }

            labels[i] = { ...labels[i], ...label };
        }
    },

    /**
     * Add a single text label.
     * @static
     * @param {TextLabel} label
     * @memberof MarkerController
     */
    append(label: TextLabel) {
        if (!label.uid) {
            alt.logError(`(${JSON.stringify(label.data)}) Label is missing uid.`);
            return;
        }

        const index = labels.findIndex((x) => x.uid === label.uid);
        if (index === -1) {
            labels.push(label);
        } else {
            labels[index] = label;
        }

        if (!interval) {
            interval = Timer.createInterval(handleDrawTextlabels, 0, 'textlabel.ts');
        }
    },

    /**
     * Used to populate server-side markers.
     * The function looks at current markers and removes them if they are server-wide.
     *
     * @static
     * @param {Array<Marker>} labels
     * @memberof MarkerController
     */
    populate(serverLabels: Array<TextLabel>) {
        labels = labels.filter((x) => !x.isServerWide).concat(serverLabels);

        if (!interval) {
            interval = Timer.createInterval(handleDrawTextlabels, 0, 'textlabel.ts');
        }
    },

    /**
     * Remove a marker from being drawn.
     * @static
     * @param {string} uid
     * @return {*}
     * @memberof MarkerController
     */
    remove(uid: string) {
        isRemoving = true;

        for (let i = labels.length - 1; i >= 0; i--) {
            if (labels[i].uid !== uid) {
                continue;
            }

            labels.splice(i, 1);
        }

        isRemoving = false;
    },
};

function handleDrawTextlabels() {
    if (isRemoving) {
        return;
    }

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

alt.on('connectionComplete', ClientTextLabelController.init);
alt.on('disconnect', ClientTextLabelController.stop);
alt.onServer(SYSTEM_EVENTS.APPEND_TEXTLABELS, ClientTextLabelController.append);
alt.onServer(SYSTEM_EVENTS.POPULATE_TEXTLABELS, ClientTextLabelController.populate);
alt.onServer(SYSTEM_EVENTS.REMOVE_TEXTLABEL, ClientTextLabelController.remove);
alt.onServer(SYSTEM_EVENTS.UPDATE_TEXT_LABEL, ClientTextLabelController.update);
