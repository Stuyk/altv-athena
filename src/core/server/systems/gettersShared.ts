import * as alt from 'alt-server';
import { distance } from '@AthenaShared/utility/vector';

/**
 * A generic getter for closest of vehicle, or player types.
 *
 * @export
 * @template T
 * @param {alt.Entity} entity
 * @param {('vehicle' | 'player')} type
 * @return {(T | alt.Entity)}
 */
export function getClosestOfType<T = alt.Entity>(entity: alt.Entity, type: 'vehicle' | 'player'): T {
    if (type === 'vehicle' && alt.Vehicle.all.length <= 0) {
        return undefined;
    }

    if (type === 'player' && alt.Player.all.length <= 0) {
        return undefined;
    }

    let entities: Array<alt.Entity>;

    if (type === 'vehicle') {
        entities = [...alt.Vehicle.all];
    }

    if (type === 'player') {
        entities = [...alt.Player.all];
    }

    let targetEntity: T | alt.Entity;
    let dist;

    for (let i = 0; i < entities.length; i++) {
        const target = entities[i];
        if (!target || !target.valid) {
            continue;
        }

        const targetDistance = distance(entity.pos, target.pos);
        if (entity instanceof alt.Player && type === 'player') {
            if (entity.id === target.id) {
                continue;
            }

            if (!target['data']) {
                continue;
            }

            // Did not select a character.
            if (!target['data']['_id']) {
                continue;
            }
        }

        if (entity instanceof alt.Vehicle && type === 'vehicle' && entity.id === target.id) {
            continue;
        }

        if (typeof dist !== 'undefined' && dist < targetDistance) {
            continue;
        }

        dist = targetDistance;
        targetEntity = target;
    }

    return targetEntity as T;
}
