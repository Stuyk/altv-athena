import { Athena } from '@AthenaServer/api/athena';
import { ATHENA_EVENTS_PLAYER } from '@AthenaShared/enums/athenaEvents';
import { PLAYER_LOCAL_META } from '@AthenaShared/enums/playerSynced';
import { StoredItem } from '@AthenaShared/interfaces/item';
import * as alt from 'alt-server';

/**
 * This synchronizes the inventory when the player selects their character.
 * Can be fetched on client-side with getLocalMeta
 *
 * @param {alt.Player} player
 */
function sync(player: alt.Player) {
    if (!player || !player.valid) {
        return;
    }

    const data = Athena.document.character.get(player);
    if (typeof data === 'undefined') {
        return;
    }

    const inventory: Array<StoredItem> = typeof data.inventory !== 'undefined' ? data.inventory : [];
    const toolbar: Array<StoredItem> = typeof data.toolbar !== 'undefined' ? data.toolbar : [];

    const fullInventory = Athena.systems.itemManager.inventory.convertFromStored(inventory);
    const fullToolbar = Athena.systems.itemManager.inventory.convertFromStored(toolbar);

    player.setLocalMeta(PLAYER_LOCAL_META.INVENTORY, fullInventory);
    player.setLocalMeta(PLAYER_LOCAL_META.TOOLBAR, fullToolbar);
}

function syncInventory(player: alt.Player, newValue: Array<StoredItem>) {
    const fullInventory = Athena.systems.itemManager.inventory.convertFromStored(newValue);
    player.setLocalMeta(PLAYER_LOCAL_META.INVENTORY, fullInventory);
}

function syncToolbar(player: alt.Player, newValue: Array<StoredItem>) {
    const fullToolbar = Athena.systems.itemManager.inventory.convertFromStored(newValue);
    player.setLocalMeta(PLAYER_LOCAL_META.TOOLBAR, fullToolbar);
}

export const InventoryView = {
    init() {
        Athena.events.player.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, sync);
        Athena.document.character.onChange('inventory', syncInventory);
        Athena.document.character.onChange('toolbar', syncToolbar);
    },
};

// import { INVENTORY_EVENTS } from '../../shared/events';

// const sessions: Array<number> = [];

// const InternalFuncs = {
//     use(player: alt.Player) {
//         if (!InventoryView.isSessionOpen(player)) {
//             return;
//         }
//     },
//     drop(player: alt.Player) {
//         if (!InventoryView.isSessionOpen(player)) {
//             return;
//         }
//     },
//     split(player: alt.Player) {
//         if (!InventoryView.isSessionOpen(player)) {
//             return;
//         }
//     },
//     swap(player: alt.Player) {
//         if (!InventoryView.isSessionOpen(player)) {
//             return;
//         }
//     },
// };

// export class InventoryView {
//     static init() {
//         alt.on('playerDisconnect', InventoryView.closeSession);

//         // General Events for Inventory View
//         alt.onClient(INVENTORY_EVENTS.TO_SERVER.USE, InternalFuncs.use);
//         alt.onClient(INVENTORY_EVENTS.TO_SERVER.DROP, InternalFuncs.drop);
//         alt.onClient(INVENTORY_EVENTS.TO_SERVER.SPLIT, InternalFuncs.split);
//         alt.onClient(INVENTORY_EVENTS.TO_SERVER.SWAP, InternalFuncs.swap);

//         // Inventory View Controlling
//         alt.onClient(INVENTORY_EVENTS.TO_SERVER.CLOSE, InventoryView.closeSession);
//         alt.onClient(INVENTORY_EVENTS.TO_SERVER.OPEN, InventoryView.openSession);
//     }

//     /**
//      * Removes an opened session.
//      * Sessions let us determine if the server allowed them to open their inventory or not.
//      *
//      * @static
//      * @memberof InventoryView
//      */
//     static closeSession(player: alt.Player) {
//         const id = player.id;
//         if (typeof id === 'undefined') {
//             return;
//         }

//         const index = sessions.findIndex((x) => x === id);
//         if (index <= 0) {
//             for (let i = sessions.length - 1; i >= 0; i--) {
//                 if (i !== index) {
//                     continue;
//                 }

//                 sessions.splice(i, 1);
//                 break;
//             }
//         }

//         if (!player || !player.valid) {
//             return;
//         }

//         alt.emitClient(player, INVENTORY_EVENTS.TO_CLIENT.CLOSE);
//     }

//     static openSession(player: alt.Player) {
//         if (player.data.isDead) {
//             return;
//         }

//         const index = sessions.findIndex((x) => x === player.id);
//         if (index <= -1) {
//             sessions.push(player.id);
//         }

//         alt.emitClient(
//             player,
//             INVENTORY_EVENTS.TO_CLIENT.OPEN,
//             player.data.inventory,
//             player.data.equipment,
//             player.data.toolbar,
//         );
//     }

//     /**
//      * Used to determine if an inventory is open for a player.
//      *
//      * @static
//      * @param {alt.Player} player
//      * @return {*}
//      * @memberof InventoryView
//      */
//     static isSessionOpen(player: alt.Player) {
//         return sessions.findIndex((x) => x === player.id) >= 0;
//     }
// }
