import * as alt from 'alt-shared';
import { distance } from './vector';

const DEFAULT_START_DISTANCE = 100;

export function getClosestOfType<T = { pos: alt.IVector3 }>(
    pos: alt.IVector3,
    elements: readonly (T & { pos: alt.IVector3 })[],
): T | undefined {
    let lastDistance = DEFAULT_START_DISTANCE;
    let lastClosest;

    for (let i = 0; i < elements.length; i++) {
        const dist = distance(pos, elements[i].pos);
        if (dist < lastDistance) {
            lastClosest = elements[i];
            lastDistance = dist;
        }
    }

    return lastClosest;
}
