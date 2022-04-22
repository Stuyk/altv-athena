import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import ChatController from '../../../../server/systems/chat';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { FactionHandler } from './handler';

export class FactionCommands {
    /**
     * This function adds a command to the chat controller
     */
    static init() {
        ChatController.addCommand('fcreate', '/fcreate <name>', PERMISSIONS.ADMIN, FactionCommands.handleCreate);
        ChatController.addCommand('fopen', '/fopen - Open Faction Menu', PERMISSIONS.NONE, FactionCommands.open);
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

    static async open(player: alt.Player) {
        if (!player.data.faction) {
            Athena.player.emit.message(player, 'You are not in a faction.');
            return;
        }

        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            Athena.player.emit.message(player, 'You are not in a faction.');
            return;
        }

        alt.emitClient(player, FACTION_EVENTS.PROTOCOL.OPEN, faction);
    }
}
