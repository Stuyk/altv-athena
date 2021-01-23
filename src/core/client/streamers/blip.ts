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

const generatedBlipList = [];
const categoriesWithDistance = [
    { name: 'atm', displayName: 'ATM', sprite: 207, color: 2 },
    { name: 'gas', displayName: 'Gas Station', sprite: 361, color: 1 }
];

// Filters and Reconstructs Grid List
for (let i = 0; i < gridData.length; i++) {
    const grid = { ...gridData[i] };
    Object.keys(grid.objects).forEach((key) => {
        grid.objects[key] = grid.objects[key].filter((data) => data.isBlip);
    });
    generatedBlipList.push(grid);
}

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

    if (lastGridSpace === null || lastGridSpace === undefined) {
        lastGridSpace = gridSpace;
    }

    if (lastGridSpace === gridSpace && hasPopulatedOnce) {
        for (let i = 0; i < categoriesWithDistance.length; i++) {
            const category = categoriesWithDistance[i];
            alt.setTimeout(() => updateCategory(category.name), 0);
        }
        return;
    }

    if (lastGridSpace !== gridSpace && hasPopulatedOnce) {
        for (let i = 0; i < categoriesWithDistance.length; i++) {
            await Blip.clearEntireCategory(categoriesWithDistance[i].name);
            streamBlips[categoriesWithDistance[i].name] = [];
        }
    }

    for (let i = 0; i < categoriesWithDistance.length; i++) {
        const categoryData = categoriesWithDistance[i];
        const category = generatedBlipList[gridSpace].objects[categoryData.name]; // Get Array of Data
        for (let x = 0; x < category.length; x++) {
            const data = category[x];
            if (!data.isBlip) {
                continue;
            }

            const pos = data.position;
            const newStreamBlip = new StreamBlip(
                pos,
                categoryData.sprite,
                categoryData.color,
                categoryData.name.toUpperCase(),
                categoryData.name.toLocaleLowerCase(),
                MAX_BLIP_STREAM_DISTANCE,
                true
            );

            streamBlips[categoryData.name].push(newStreamBlip);
        }
    }

    if (!hasPopulatedOnce) {
        hasPopulatedOnce = true;
    }

    lastGridSpace = gridSpace;

    for (let i = 0; i < categoriesWithDistance.length; i++) {
        const category = categoriesWithDistance[i];
        alt.setTimeout(() => updateCategory(category.name), 0);
    }
}

/**
 * Updates the blips that are closest to you.
 * @param {string} category atm, vending, etc.
 */
function updateCategory(category: string): void {
    const blips = streamBlips[category];
    for (let i = 0; i < blips.length; i++) {
        const blip = blips[i];
        const range = distance2d(alt.Player.local.pos, blip.pos);

        if (range > MAX_BLIP_STREAM_DISTANCE) {
            blip.safeDestroy();
            continue;
        }

        blip.safeCreate();
    }
}
