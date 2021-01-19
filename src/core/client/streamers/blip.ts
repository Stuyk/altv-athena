import * as alt from 'alt-client';
import gridData from '../../shared/information/gridData';
import { Blip, StreamBlip } from '../extensions/blip';
import { distance2d } from '../../shared/utility/vector';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { SHARED_CONFIG } from '../../shared/configurations/shared';

const MAX_BLIP_STREAM_DISTANCE = SHARED_CONFIG.MAX_BLIP_STREAM_DISTANCE;
const streamBlips: { [key: string]: Array<StreamBlip> } = {
    atm: [],
    gas: []
};

let categoriesWithDistance = ['atm', 'gas'];
let hasPopulatedOnce = false;
let lastGridSpace: number | null;

// We use the weather updater because it's a consistent event.
alt.onServer(SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, handleStreamChanges);

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
        for (let i = 0; i < categoriesWithDistance.length; i++) {
            await Blip.clearEntireCategory(categoriesWithDistance[i]);
            streamBlips[categoriesWithDistance[i]] = [];
        }
    }

    for (let i = 0; i < categoriesWithDistance.length; i++) {
        const categoryName = categoriesWithDistance[i];
        const category = gridData[gridSpace].objects[categoryName]; // Get Array of Data
        for (let x = 0; x < category.length; x++) {
            const data = category[x];
            const pos = {
                x: data.Position.X,
                y: data.Position.Y,
                z: data.Position.Z
            } as alt.Vector3;

            const newStreamBlip = new StreamBlip(
                pos,
                108,
                2,
                categoryName.toUpperCase(),
                categoryName.toLocaleLowerCase(),
                MAX_BLIP_STREAM_DISTANCE,
                true
            );

            streamBlips[categoryName].push(newStreamBlip);
        }
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

    if (lastRange > SHARED_CONFIG.MAX_INTERACTION_RANGE) {
        alt.Player.local.closestInteraction = null;
    }
}
