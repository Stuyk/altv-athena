import * as alt from 'alt-server';
import { INVENTORY_TYPE } from '../../shared/enums/inventoryTypes';
import { Item } from '../../shared/interfaces/item';

type EffectCallback = (player: alt.Player, item: Item, slot: number, inventoryType: string) => void;

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
    static invoke(player: alt.Player, item: Item, type: INVENTORY_TYPE) {
        if (!item.data) {
            return;
        }

        if (!item.data.event) {
            return;
        }

        const callback = effects.get(item.data.event);
        if (!callback || typeof callback !== 'function') {
            return;
        }

        callback(player, item, item.slot, type);
    }
}
