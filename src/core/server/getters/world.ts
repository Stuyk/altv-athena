import * as alt from 'alt-server';

/**
 * Check if a world position is free of vehicles.
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {string} type
 * @return {Promise<boolean>}
 */
export async function positionIsClear(pos: alt.IVector3, lookFor: 'vehicle' | 'player' | 'all'): Promise<boolean> {
    const colshape = new alt.ColshapeCylinder(pos.x, pos.y, pos.z - 1, 2, 2);
    await alt.Utils.wait(10);

    let entity: alt.Entity;
    if (lookFor === 'vehicle' || lookFor === 'all') {
        entity = alt.Vehicle.all.find((veh) => colshape.isEntityIn(veh));
    }

    if (typeof entity !== 'undefined') {
        return false;
    }

    if (lookFor === 'player' || lookFor === 'all') {
        entity = alt.Player.all.find((p) => colshape.isEntityIn(p));
    }

    if (typeof entity !== 'undefined') {
        return false;
    }

    return typeof entity === 'undefined' ? true : false;
}

/**
 * Used to check if an entity is in ocean water.
 * Uses a simple 'z' positional check and dimension check.
 *
 * @param {alt.Entity} entity
 */
export function isInOceanWater(entity: alt.Entity) {
    if (entity.dimension !== 0) {
        alt.log('wrong dimension');
        return false;
    }

    if (entity.pos.z - 1 > 0.5) {
        return false;
    }

    return true;
}
