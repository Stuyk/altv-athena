import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/PermissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';
import { FactionSystem } from '../systems/factions';
import { FactionInternalSystem } from '../systems/factionsInternal';

function handleCreate(player: alt.Player, ...name: string[]): void {
    if (!player || !player.valid || player.data.faction) {
        playerFuncs.emit.message(player, `Leave your faction or transfer ownership before creating a new one.`);
        return;
    }

    if (!name || name.length <= 0) {
        playerFuncs.emit.message(player, `Must Specify Faction Name`);
        return;
    }

    const actualName = name.join(' ');
    FactionInternalSystem.create(player, { name: actualName, pos: player.pos, logs: [] });
}

async function handleTakeover(player: alt.Player, id: string) {
    if (!id) {
        return;
    }

    const faction = FactionInternalSystem.get(id);
    if (!faction) {
        playerFuncs.emit.message(player, `Not a Valid Faction`);
        return;
    }

    const result = await FactionInternalSystem.takeOverFaction(player, id);
    if (!result) {
        playerFuncs.emit.message(player, `Could not take faction.`);
        return;
    }

    playerFuncs.emit.message(player, `Took Over Faction: ${faction.name}`);
}

async function handleHandOff(player: alt.Player) {
    if (!player || !player.data || !player.data.faction) {
        return;
    }

    const faction = FactionInternalSystem.get(player.data.faction);
    if (!faction) {
        playerFuncs.emit.message(player, `Not a Valid Faction`);
        return;
    }

    const nextInLine = faction.players[1];
    if (!nextInLine) {
        playerFuncs.emit.message(player, `Cannot hand off faction to next player.`);
        return;
    }

    const result = await FactionInternalSystem.handOffFaction(faction._id.toString(), nextInLine.id, true);
    if (!result) {
        playerFuncs.emit.message(player, `Could not hand off faction.`);
        return;
    }

    playerFuncs.emit.message(player, `Handed off faction to ${nextInLine.name}`);
}

function handleInvite(player: alt.Player, id: string) {
    if (!player || !player.data) {
        return;
    }

    if (!player.data.faction) {
        playerFuncs.emit.message(player, `You are not in a faction.`);
        return;
    }

    const faction = FactionInternalSystem.get(player.data.faction);
    if (!faction) {
        playerFuncs.emit.message(player, `You are not in a faction.`);
        return;
    }

    const foundPlayer = alt.Player.all.find((x) => `${x.id}` === `${id}`);
    if (!foundPlayer) {
        playerFuncs.emit.message(player, `Player does not exist.`);
        return;
    }

    foundPlayer.lastFactionInvite = player;
    playerFuncs.emit.message(player, `${foundPlayer.data.name} was invited.`);
    playerFuncs.emit.message(foundPlayer, `You were invited to faction ${faction.name}.`);
}

function handleAccept(player: alt.Player) {
    if (!player || !player.data) {
        return;
    }

    if (!player.data.faction) {
        playerFuncs.emit.message(player, `You are already in a faction.`);
        return;
    }

    if (!player.lastFactionInvite) {
        playerFuncs.emit.message(player, `No pending invite.`);
        return;
    }

    playerFuncs.emit.notification(player, `Attempting to accept invitation...`);
    FactionSystem.addMember(player.lastFactionInvite, player);
    player.lastFactionInvite = null;
}

ChatController.addCommand(
    'factiontake',
    '/factiontake [id] - Take Faction Ownership',
    PERMISSIONS.ADMIN,
    handleTakeover
);

ChatController.addCommand(
    'factionhandoff',
    '/factionhandoff - Hand off faction ownership.',
    PERMISSIONS.ADMIN,
    handleHandOff
);

ChatController.addCommand('factionaccept', '/factionaccept - Accept latest invite.', PERMISSIONS.NONE, handleAccept);
ChatController.addCommand('factioninvite', '/factioninvite [id] - Invite to faction', PERMISSIONS.NONE, handleInvite);
ChatController.addCommand('factioncreate', '/factioncreate [name] - Create a faction', PERMISSIONS.ADMIN, handleCreate);
