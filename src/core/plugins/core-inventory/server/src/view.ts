import * as alt from 'alt-server';
import { INVENTORY_EVENTS } from '../../shared/events';

const sessions: Array<number> = [];

const InternalFuncs = {
    use(player: alt.Player) {
        if (!InventoryView.isSessionOpen(player)) {
            return;
        }
    },
    drop(player: alt.Player) {
        if (!InventoryView.isSessionOpen(player)) {
            return;
        }
    },
    split(player: alt.Player) {
        if (!InventoryView.isSessionOpen(player)) {
            return;
        }
    },
    swap(player: alt.Player) {
        if (!InventoryView.isSessionOpen(player)) {
            return;
        }
    },
};

export class InventoryView {
    static init() {
        alt.on('playerDisconnect', InventoryView.closeSession);

        // General Events for Inventory View
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.USE, InternalFuncs.use);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.DROP, InternalFuncs.drop);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.SPLIT, InternalFuncs.split);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.SWAP, InternalFuncs.swap);

        // Inventory View Controlling
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.CLOSE, InventoryView.closeSession);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.OPEN, InventoryView.openSession);
    }

    /**
     * Removes an opened session.
     * Sessions let us determine if the server allowed them to open their inventory or not.
     *
     * @static
     * @memberof InventoryView
     */
    static closeSession(player: alt.Player) {
        const id = player.id;
        if (typeof id === 'undefined') {
            return;
        }

        const index = sessions.findIndex((x) => x === id);
        if (index <= 0) {
            for (let i = sessions.length - 1; i >= 0; i--) {
                if (i !== index) {
                    continue;
                }

                sessions.splice(i, 1);
                break;
            }
        }

        if (!player || !player.valid) {
            return;
        }

        alt.emitClient(player, INVENTORY_EVENTS.TO_CLIENT.CLOSE);
    }

    static openSession(player: alt.Player) {
        if (player.data.isDead) {
            return;
        }

        const index = sessions.findIndex((x) => x === player.id);
        if (index <= -1) {
            sessions.push(player.id);
        }

        alt.emitClient(
            player,
            INVENTORY_EVENTS.TO_CLIENT.OPEN,
            player.data.inventory,
            player.data.equipment,
            player.data.toolbar,
        );
    }

    /**
     * Used to determine if an inventory is open for a player.
     *
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof InventoryView
     */
    static isSessionOpen(player: alt.Player) {
        return sessions.findIndex((x) => x === player.id) >= 0;
    }
}
