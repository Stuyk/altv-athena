import * as alt from 'alt-server';

import { SYSTEM_EVENTS } from '../../shared/enums/system.js';
import { IObject } from '../../shared/interfaces/iObject.js';
import { sha256Random } from '../utility/hash.js';
import { ControllerFuncs } from './shared.js';

const globalObjects: Array<IObject & { object: alt.Object }> = [];

/**
 * Add an object to the global world.
 *
 * These objects should not be used to construct interiors.
 *
 * Create an MLO, or use something like CodeWalker to create large scale map changes.
 *
 * Returns a uid or generates one if not specified.
 *
 * #### Example
 * ```ts
 * const uid = Athena.controllers.object.append({
 *      model: 'prop_pizza_oven_01',
 *      pos: { x: 0, y: 0, z: 0}
 * });
 *
 * Athena.controllers.object.append({
 *      uid: 'the-uid-you-specified',
 *      model: 'prop_pizza_oven_01',
 *      pos: { x: 0, y: 0, z: 0}
 * });
 *
 * ```
 *
 * @param {IObject} objectData
 * @return {string} uid A unique string for object
 */
export function append(objectData: IObject): string {
    if (Overrides.append) {
        return Overrides.append(objectData);
    }

    if (!objectData.uid) {
        objectData.uid = sha256Random(JSON.stringify(objectData));
    }

    if (!objectData.rot) {
        objectData.rot = new alt.Vector3(0, 0, 0);
    }

    const newObject = {
        ...objectData,
        object: new alt.Object(objectData.model, objectData.pos, objectData.rot ? objectData.rot : alt.Vector3.zero),
    };

    newObject.object.frozen = true;
    newObject.object.dimension = objectData.dimension ? objectData.dimension : 0;

    if (objectData.noCollision) {
        newObject.object.collision = false;
    }

    globalObjects.push(newObject);
    return objectData.uid;
}

/**
 * Removes an object from the global world.
 *
 * If the object was found and removed this will return true.
 *
 * #### Example
 * ```ts
 * const result = Athena.controllers.object.remove(someUid);
 *
 * Athena.controllers.object.remove('the-uid-you-specified');
 * ```
 *
 *
 * @param {string} uid A unique string
 * @return {boolean}
 */
export function remove(uid: string): boolean {
    if (Overrides.remove) {
        return Overrides.remove(uid);
    }

    let wasFound = false;
    for (let i = globalObjects.length - 1; i >= 0; i--) {
        if (globalObjects[i].uid !== uid) {
            continue;
        }

        try {
            globalObjects[i].object.destroy();
        } catch (err) {}

        globalObjects.splice(i, 1);
        wasFound = true;
        break;
    }

    if (!wasFound) {
        return false;
    }

    return true;
}

/**
 * Remove an object from the player that only they can see.
 *
 * #### Example
 * ```ts
 * Athena.controllers.object.removeFromPlayer(somePlayer, someUid);
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} uid A unique string
 */
export function removeFromPlayer(player: alt.Player, uid: string) {
    if (Overrides.removeFromPlayer) {
        return Overrides.removeFromPlayer(player, uid);
    }

    if (!uid) {
        throw new Error(`Did not specify a uid for object removal. ObjectController.removeFromPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.REMOVE_OBJECT, uid);
}

/**
 * Add an object to the player that only they can see.
 *
 * Returns a uid or generates one if not specified.
 *
 * #### Example
 * ```ts
 * const uid = Athena.controllers.object.addToPlayer(somePlayer, {
 *      model: 'prop_pizza_oven_01',
 *      pos: { x: 0, y: 0, z: 0}
 * });
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {IObject} objectData
 * @returns {string} uid A unique string for object
 */
export function addToPlayer(player: alt.Player, objectData: IObject): string {
    if (Overrides.addToPlayer) {
        return Overrides.addToPlayer(player, objectData);
    }

    if (!objectData.uid) {
        objectData.uid = sha256Random(JSON.stringify(objectData));
    }

    if (!objectData.rot) {
        objectData.rot = alt.Vector3.zero;
    }

    alt.emitClient(player, SYSTEM_EVENTS.APPEND_OBJECT, objectData);
    return objectData.uid;
}

/**
 * Updates the position for an object.
 *
 * > NOT ALL OBJECTS CAN BE MOVED DYNAMICALLY.
 *
 * #### Example
 *
 * ### Non-Player Object
 *
 * ```ts
 * Athena.controllers.object.updatePosition(someUid, { x: 0, y: 0, z: 0});
 * ```
 *
 * ### Player Object
 *
 * ```ts
 * Athena.controllers.object.updatePosition(someUid, { x: 0, y: 0, z: 0}, somePlayer);
 * ```
 *
 * @param {string} uid A unique string
 * @param {alt.IVector3} pos A position in the world.
 * @param {alt.Player} [player=undefined]
 */
export function updatePosition(uid: string, pos: alt.IVector3, player: alt.Player = undefined): boolean {
    if (Overrides.updatePosition) {
        return Overrides.updatePosition(uid, pos, player);
    }

    if (typeof player === 'undefined') {
        const index = globalObjects.findIndex((x) => x.uid === uid);
        if (index === -1) {
            console.log('could not find');
            return false;
        }

        globalObjects[index].pos = pos;
        globalObjects[index].object.pos = new alt.Vector3(pos);
        return true;
    }

    alt.emitClient(player, SYSTEM_EVENTS.MOVE_OBJECT, uid, pos);
    return true;
}

export function updateModel(uid: string, model: string, player: alt.Player = undefined): boolean {
    if (typeof player === 'undefined') {
        const index = globalObjects.findIndex((x) => x.uid === uid);
        if (index === -1) {
            return false;
        }

        globalObjects[index].model = model;
        globalObjects[index].object.model = model;
        return true;
    }

    alt.emitClient(player, SYSTEM_EVENTS.UPDATE_OBJECT_MODEL, uid, model);
    return true;
}

interface ObjectControllerFuncs
    extends ControllerFuncs<typeof append, typeof remove, typeof addToPlayer, typeof removeFromPlayer> {
    updatePosition: typeof updatePosition;
    updateModel: typeof updateModel;
}

const Overrides: Partial<ObjectControllerFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'addToPlayer', callback: typeof addToPlayer);
export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer);
export function override(functionName: 'updatePosition', callback: typeof updatePosition);
export function override(functionName: 'updateModel', callback: typeof updateModel);
/**
 * Used to override any object streamer functionality
 *
 *
 * @param {keyof ObjectControllerFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof ObjectControllerFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
