import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Blip } from '../../shared/interfaces/Blip';

alt.onServer(SYSTEM_EVENTS.POPULATE_BLIPS, handleAddBlips);

let addedBlips: Array<any> = [];

function handleAddBlips(blips: Array<Blip>) {
    for (let i = 0; i < blips.length; i++) {
        const blipData = blips[i];
        const blip = new alt.PointBlip(blipData.pos.x, blipData.pos.y, blipData.pos.z);
        blip.sprite = blipData.sprite;
        blip.color = blipData.color;
        blip.shortRange = blipData.shortRange;
        blip.name = blipData.text;

        if (blip.hasOwnProperty('size')) {
            blip.size = { x: blipData.scale, y: blipData.scale } as alt.Vector2;
        } else {
            blip.scale = blipData.scale;
        }

        addedBlips.push(blip);
    }
}
