import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';

export type InventoryType = 'inventory' | 'toolbar';
export type EffectCallback = (player: alt.Player, slot: number, type: 'inventory' | 'toolbar') => void;

const effects: Map<string, EffectCallback> = new Map();

/**
 * Register an item effect to invoke a callback on consumption.
 *
 * @static
 * @param {string} effectName
 * @param {EffectCallback} callback
 *
 */
export function add(effectNameFromItem: string, callback: EffectCallback) {
    if (Overrides.add) {
        return Overrides.add(effectNameFromItem, callback);
    }

    if (effects.has(effectNameFromItem)) {
        alt.logWarning(`Duplicate Item Effect Found for ${effectNameFromItem}. Replaced functionality.`);
    }

    effects.set(effectNameFromItem, callback);
}

/**
 * Remove an effect from the effects map.
 *
 * @param {string} effectName - The name of the effect to remove.
 * @returns The value of the effect.
 */
export function remove(effectName: string): boolean {
    if (Overrides.remove) {
        return Overrides.remove(effectName);
    }

    return effects.delete(effectName);
}

/**
 * Invokes a callback for an item effect
 *
 * @param player - The player who is using the item.
 * @param {Item} item - The item object.
 * @param {INVENTORY_TYPE} type - INVENTORY_TYPE
 * @returns The callback function.
 */
export function invoke(
    player: alt.Player,
    slot: number,
    type: InventoryType,
    eventToCall: string | string[] = undefined,
): boolean {
    if (Overrides.invoke) {
        return Overrides.invoke(player, slot, type);
    }

    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return false;
    }

    const actualType = String(type);
    if (typeof data[actualType] === 'undefined' || !Array.isArray(data[actualType])) {
        return false;
    }

    const item = Athena.systems.inventory.slot.getAt(slot, data[actualType]);
    if (typeof item === 'undefined') {
        return false;
    }

    const baseItem = Athena.systems.inventory.factory.getBaseItem(item.dbName, item.version);
    if (typeof baseItem === 'undefined') {
        return false;
    }

    if (typeof eventToCall === 'undefined' || eventToCall === null) {
        if (typeof baseItem.consumableEventToCall === 'string') {
            const callback = effects.get(baseItem.consumableEventToCall);
            if (!callback || typeof callback !== 'function') {
                return false;
            }

            callback(player, item.slot, type);
            return true;
        }

        if (!Array.isArray(baseItem.consumableEventToCall)) {
            return false;
        }

        for (let effectName of baseItem.consumableEventToCall) {
            const callback = effects.get(effectName);
            if (!callback || typeof callback !== 'function') {
                alt.logWarning(`Could not find effect with name '${effectName}' to invoke.`);
                continue;
            }

            callback(player, item.slot, type);
        }
    } else {
        if (typeof eventToCall === 'string') {
            const callback = effects.get(eventToCall);
            if (!callback || typeof callback !== 'function') {
                return false;
            }

            callback(player, item.slot, type);
            return true;
        }

        if (!Array.isArray(eventToCall)) {
            return false;
        }

        for (let effectName of eventToCall) {
            const callback = effects.get(effectName);
            if (!callback || typeof callback !== 'function') {
                alt.logWarning(`Could not find effect with name '${effectName}' to invoke.`);
                continue;
            }

            callback(player, item.slot, type);
        }
    }

    return true;
}

interface EffectFuncs {
    add: typeof add;
    remove: typeof remove;
    invoke: typeof invoke;
}

const Overrides: Partial<EffectFuncs> = {};

export function override(functionName: 'add', callback: typeof add);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'invoke', callback: typeof invoke);
/**
 * Used to override inventory item effects functionality
 *
 *
 * @param {keyof EffectFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof EffectFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
