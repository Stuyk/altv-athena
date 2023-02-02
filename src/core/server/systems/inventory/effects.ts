import * as alt from 'alt-server';

import { Athena } from '@AthenaServer/api/athena';
import { ItemManager } from './manager';
import { ItemFactory } from './factory';

type InventoryType = 'inventory' | 'toolbar';
type EffectCallback = (player: alt.Player, slot: number, type: 'inventory' | 'toolbar') => void;

const effects: Map<string, EffectCallback> = new Map();

export class ItemEffects {
    /**
     * Register an item effect to invoke a callback on consumption.
     *
     * @static
     * @param {string} effectName
     * @param {EffectCallback} callback
     * @memberof ItemEffects
     */
    static add(effectNameFromItem: string, callback: EffectCallback) {
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
    static remove(effectName: string): boolean {
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
    static invoke(player: alt.Player, slot: number, type: InventoryType): boolean {
        const data = Athena.document.character.get(player);
        if (typeof data === 'undefined') {
            return false;
        }

        const actualType = String(type);
        if (typeof data[actualType] === 'undefined' || !Array.isArray(data[actualType])) {
            return false;
        }

        const item = ItemManager.slot.getAt(slot, data[actualType]);
        if (typeof item === 'undefined') {
            return false;
        }

        const baseItem = ItemFactory.sync.getBaseItem(item.dbName, item.version);
        if (typeof baseItem === 'undefined') {
            return false;
        }

        const callback = effects.get(baseItem.consumableEventToCall);
        if (!callback || typeof callback !== 'function') {
            return false;
        }

        callback(player, item.slot, type);
        return true;
    }
}
