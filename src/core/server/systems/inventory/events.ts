import * as alt from 'alt-server';

interface InventoryEventCallbacks {
    /**
     * Invoked when a player has dropped an item.
     *
     * @param {alt.Player} player
     * @param {string} dbName
     * @param {number} slot
     * @memberof InventoryEventCallbacks
     */
    onDrop(player: alt.Player, dbName: string, slot: number): void;
}

interface InventoryEventTriggers {
    /**
     * Invoked when a player has dropped an item.
     *
     * @type {[player: alt.Player, dbName: string, slot: number]}
     * @memberof InventoryEventTriggers
     */
    onDrop: [dbName: string, slot: number];
}

const callbacks: { [key in keyof InventoryEventTriggers]?: Array<(...args: any[]) => void> } = {};

/**
 * Invoke an inventory event.
 *
 * @export
 * @template K
 * @param {K} event
 * @param {...InventoryEventTriggers[K]} args
 */
export function invoke<K extends keyof InventoryEventTriggers>(
    player: alt.Player,
    event: K,
    ...args: InventoryEventTriggers[K]
) {
    if (!callbacks[event]) {
        return;
    }

    for (let cb of callbacks[event]) {
        cb(player, ...args);
    }
}

/**
 * Listen for an invoked inventory event.
 *
 * @export
 * @template K
 * @param {K} event
 * @param {InventoryEventCallbacks[K]} callback
 */
export function on<K extends keyof InventoryEventCallbacks>(event: K, callback: InventoryEventCallbacks[K]) {
    if (!callbacks[event]) {
        callbacks[event] = [];
    }

    callbacks[event].push(callback);
}
