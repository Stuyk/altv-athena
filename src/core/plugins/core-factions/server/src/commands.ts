import * as alt from 'alt-server';
import { AthenaEvents } from '../../../../client/systems/athenaEvents';
import { Athena } from '../../../../server/api/athena';
import ChatController from '../../../../server/systems/chat';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { FactionFuncs } from './funcs';
import { FactionHandler } from './handler';
import { FactionPlayerFuncs } from './playerFuncs';

const lastInvite: { [character: string]: string } = {};

export class FactionCommands {
    /**
     * This function adds a command to the chat controller
     */
    static init() {
        ChatController.addCommand('fcreate', '/fcreate [name]', PERMISSIONS.ADMIN, FactionCommands.handleCreate);
        ChatController.addCommand('fopen', '/fopen - Open Faction Menu', PERMISSIONS.NONE, FactionCommands.open);
        ChatController.addCommand(
            'fjoin',
            '/fjoin [uid] - Quits Current Faction & Joins Another',
            PERMISSIONS.ADMIN,
            FactionCommands.forceJoin,
        );
        ChatController.addCommand(
            'finvite',
            '/finvite [id_or_first_last] - Invite to faction',
            PERMISSIONS.NONE,
            FactionCommands.invite,
        );
        ChatController.addCommand(
            'faccept',
            '/faccept - Join last invited to faction',
            PERMISSIONS.NONE,
            FactionCommands.accept,
        );
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

    static async forceJoin(player: alt.Player, uid: string) {
        if (!uid) {
            Athena.player.emit.message(player, `You must specify a faction UID to join.`);
            return;
        }

        const faction = FactionHandler.get(uid);
        if (!faction) {
            Athena.player.emit.message(player, `That faction does not exist.`);
            return;
        }

        if (player.data.faction) {
            const currentFaction = FactionHandler.get(player.data.faction);
            if (currentFaction) {
                await FactionFuncs.kickMember(currentFaction, player.data._id);
            }
        }

        FactionFuncs.addMember(faction, player.data._id);
        Athena.player.emit.message(player, `Moved to Faction: ${faction.name}`);
    }

    static async invite(player: alt.Player, idOrName: string) {
        const faction = FactionHandler.get(player.data.faction);
        if (!faction) {
            Athena.player.emit.message(player, `You are not in a faction.`);
            return;
        }

        const rank = FactionPlayerFuncs.getPlayerFactionRank(player);
        if (!rank) {
            Athena.player.emit.message(player, `You have no rank in the faction?`);
            return;
        }

        if (!rank.rankPermissions.addMembers) {
            Athena.player.emit.message(player, `No permission to invite members to faction.`);
            return;
        }

        let target: alt.Player;

        if (isNaN(parseInt(idOrName))) {
            target = alt.Player.all.find(
                (x) => x && x.data && x.data.name.toLowerCase().includes(idOrName.toLowerCase()),
            );
        } else {
            target = Athena.player.get.findByUid(idOrName);
        }

        if (!target || !target.data || !target.valid || !idOrName || target === player) {
            Athena.player.emit.message(player, `/finvite [id_or_first_last]`);
            return;
        }

        if (target.data.faction) {
            Athena.player.emit.message(player, `${target.data.name} is already in a faction.`);
            return;
        }

        lastInvite[target.data._id] = player.data.faction;
        Athena.player.emit.message(player, `${target.data.name} was invited to the faction.`);
        Athena.player.emit.message(target, `${player.data.name} invited you to faction ${faction.name}.`);
        Athena.player.emit.message(target, `Type '/faccept' to join`);
    }

    static async accept(player: alt.Player) {
        if (player.data.faction) {
            Athena.player.emit.message(player, `Already in a faction.`);
            delete lastInvite[player.data._id];
            return;
        }

        if (!lastInvite[player.data._id]) {
            Athena.player.emit.message(player, `Faction invite expired.`);
            delete lastInvite[player.data._id];
            return;
        }

        const faction = FactionHandler.get(lastInvite[player.data._id]);
        if (!faction) {
            Athena.player.emit.message(player, `Faction invite expired.`);
            delete lastInvite[player.data._id];
            return;
        }

        delete lastInvite[player.data._id];
        const result = FactionFuncs.addMember(faction, player.data._id);
        if (!result) {
            Athena.player.emit.message(player, `Failed to join faction.`);
            return;
        }

        Athena.player.emit.message(player, `Joined faction ${faction.name}`);
    }
}
