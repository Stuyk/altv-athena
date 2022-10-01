import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Blip } from '../../shared/interfaces/blip';

const addedBlips: Array<alt.PointBlip> = [];

function create(blipData: Blip): alt.PointBlip {
    const blip = new alt.PointBlip(blipData.pos.x, blipData.pos.y, blipData.pos.z);
    blip.sprite = blipData.sprite;
    blip.color = blipData.color;
    blip.shortRange = blipData.shortRange;
    blip.name = blipData.text;

    if (blipData.uid) {
        blip['uid'] = blipData.uid;
    }

    if (blip.hasOwnProperty('size')) {
        blip.size = { x: blipData.scale, y: blipData.scale } as alt.Vector2;
    } else {
        blip.scale = blipData.scale;
    }

    return blip;
}

export class BlipController {
    static append(blipData: Blip): alt.PointBlip {
        const index = addedBlips.findIndex((x) => x['uid'] && blipData.uid === x['uid']);
        if (index >= 0) {
            const removedBlips = addedBlips.splice(index, 1);
            for (let i = 0; i < removedBlips.length; i++) {
                try {
                    removedBlips[i].destroy();
                } catch (err) {}
            }
        }

        const blip = create(blipData);
        blip['uid'] = blipData.uid;
        addedBlips.push(blip);
        return blip;
    }

    static populate(blips: Array<Blip>) {
        for (let i = 0; i < blips.length; i++) {
            const blipData = blips[i];
            const blip = create(blipData);
            addedBlips.push(blip);
        }
    }

    /**
     * Remove a blip from the list of added blips.
     * @param {string} uid - The unique identifier of the blip.
     * @returns The blip object.
     */
    static remove(uid: string) {
        const index = addedBlips.findIndex((blip) => blip && blip['uid'] === uid);
        if (index <= -1) {
            return;
        }

        const blip = addedBlips[index];
        addedBlips.splice(index, 1);
        if (!blip || !blip.destroy) {
            return;
        }

        blip.destroy();
    }

    /**
     * It removes all blips from the map.
     * @returns None
     */
    static removeAll() {
        while (addedBlips.length >= 1) {
            const removedBlip = addedBlips.pop();
            try {
                removedBlip.destroy();
            } catch (err) {}
        }
    }
}

alt.onServer(SYSTEM_EVENTS.POPULATE_BLIPS, BlipController.populate);
alt.onServer(SYSTEM_EVENTS.APPEND_BLIP, BlipController.append);
alt.onServer(SYSTEM_EVENTS.REMOVE_BLIP, BlipController.remove);
alt.on('disconnect', BlipController.removeAll);
