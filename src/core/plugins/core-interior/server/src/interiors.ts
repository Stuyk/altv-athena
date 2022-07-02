import { INTERIOR_SYSTEM } from '../../shared/flags';
import { InteriorSystem } from './system';

/**
 * HEY LISTEN!
 *
 * If you can't enter your interior it's because you need to subtract 1 from z axis.
 *
 * 81.5 -> 80.5
 */

export async function createDefaultInteriors() {
    // This adds the Diamond Resorts Casino
    await InteriorSystem.add({
        name: 'Diamond Resorts Casino',
        uid: 'diamond-resort-casino',
        outside: { x: 935.1909790039062, y: 46.17036819458008, z: 80.09584045410156 },
        inside: { x: 1089.8856201171875, y: 206.2451629638672, z: -49.5 },
        objects: [],
        system: INTERIOR_SYSTEM.NONE,
        isUnlocked: true,
        interiorID: 275201,
        entitySets: [{name: "casino_manager_default", active: true},{name: "casino_manager_workout", active: false}],
    });

    // This is an example house.
    await InteriorSystem.add({
        name: 'Some Cool House',
        uid: 'some-cool-house',
        outside: { x: -841.6432495117188, y: -24.96125030517578, z: 39.39847183227539 },
        inside: { x: -786.8663, y: 315.7642, z: 216.6385 },
        system:
            INTERIOR_SYSTEM.HAS_LOCK |
            INTERIOR_SYSTEM.HAS_OWNER |
            INTERIOR_SYSTEM.HAS_PRICE |
            INTERIOR_SYSTEM.HAS_STORAGE,
        ipl: 'apa_v_mp_h_01_a',
        price: 25000,
        isUnlocked: true,
    });
}
