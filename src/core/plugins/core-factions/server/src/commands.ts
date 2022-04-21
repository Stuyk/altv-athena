import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import ChatController from '../../../../server/systems/chat';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { FactionHandler } from './handler';

export class FactionCommands {
    /**
     * This function adds a command to the chat controller
     */
    static init() {
        ChatController.addCommand('fcreate', '/fcreate <name>', PERMISSIONS.ADMIN, FactionCommands.handleCreate);
    }

    /**
     * It creates a new faction.
     * @param player - alt.Player - The player who created the faction.
     * @param {string[]} name - The name of the faction.
     * @returns The result of the add function.
     */
    static async handleCreate(player: alt.Player, ...name: string[]) {
        const factionName = name.join(' ');
        const result = await FactionHandler.add(player.data._id.toString(), {
            bank: 0,
            canDisband: true,
            name: factionName,
        });

        if (!result.status) {
            Athena.player.emit.message(player, result.response);
            return;
        }

        const id = result.response;
        Athena.player.emit.message(player, `Created Faction with ID: ${id}`);
    }
}
