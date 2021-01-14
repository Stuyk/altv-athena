import * as alt from 'alt-client';
import gridData from '../../shared/information/gridData';
import { System_Events_World } from '../../shared/enums/system';
import { Blip, StreamBlip } from '../extensions/blip';
import { distance2d } from '../../shared/utility/vector';

const MAX_BLIP_STREAM_DISTANCE = 750;
const streamBlips: { [key: string]: Array<StreamBlip> } = {
    atm: []
};

let categoriesWithDistance = ['atm'];
let hasPopulatedOnce = false;
let lastGridSpace: number | null;

// We use the weather updater because it's a consistent event.
alt.onServer(System_Events_World.UpdateWeather, handleStreamChanges);

/**
 * Happens around every ~5 seconds.
 * Takes the GridSpace of the player to populate blips.
 */
async function handleStreamChanges(): Promise<void> {
    if (!alt.Player.local.meta) {
        return;
    }

    const gridSpace = alt.Player.local.meta.gridSpace;
    if (gridSpace === null || gridSpace === undefined || gridSpace <= -1) {
        return;
    }

    if (!lastGridSpace) {
        lastGridSpace = gridSpace;
    }

    if (lastGridSpace === gridSpace && hasPopulatedOnce) {
        lastGridSpace = gridSpace;
        categoriesWithDistance.forEach(updateCategory);
        return;
    }

    if (lastGridSpace !== gridSpace && hasPopulatedOnce) {
        await Blip.clearEntireCategory('atm');
        streamBlips['atm'] = [];
    }

    // Create All New Blip Instances Here
    const atms = gridData[gridSpace].objects.atm;
    for (let i = 0; i < atms.length; i++) {
        const atm = atms[i];
        const pos = {
            x: atm.Position.X,
            y: atm.Position.Y,
            z: atm.Position.Z
        } as alt.Vector3;

        const newStreamBlip = new StreamBlip(pos, 108, 2, 'ATM', 'atm', MAX_BLIP_STREAM_DISTANCE, true);
        streamBlips.atm.push(newStreamBlip);
    }

    if (!hasPopulatedOnce) {
        hasPopulatedOnce = true;
    }

    lastGridSpace = gridSpace;
    categoriesWithDistance.forEach(updateCategory);
}

/**
 * Updates the blips that are closest to you.
 * @param {string} category atm, vending, etc.
 */
function updateCategory(category: string): void {
    const blips = streamBlips[category];
    let lastRange: number = distance2d(alt.Player.local.pos, streamBlips[category][0].pos);

    for (let i = 0; i < blips.length; i++) {
        const blip = blips[i];
        const range: null | number = blip.isInRange();

        if (range === null) {
            blip.safeDestroy();
            continue;
        }

        if (range < lastRange) {
            alt.Player.local.closestInteraction = { type: category, position: blips[i].pos };
            lastRange = range;
        }

        blip.safeCreate();
    }

    if (lastRange > 8) {
        alt.Player.local.closestInteraction = null;
    }
}
