import * as alt from 'alt-server';
import { Permissions } from 'core/shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';
import { OptionsController } from '../systems/options';

ChatController.addCommand(
    'addwhitelist',
    '/addwhitelist [discord_id]',
    Permissions.Admin | Permissions.Moderator,
    handleCommandAdd
);

ChatController.addCommand(
    'removewhitelist',
    '/removewhitelist [discord_id]',
    Permissions.Admin | Permissions.Moderator,
    handleCommandRemove
);

async function handleCommandAdd(player: alt.Player, discord: string): Promise<void> {
    if (!discord) {
        playerFuncs.emit.message(player, ChatController.getDescription('addwhitelist'));
        return;
    }

    if (discord.length <= 17) {
        playerFuncs.emit.message(player, `Discord IDs are at least 18 characters long.`);
        return;
    }

    const didAdd = OptionsController.addToWhitelist(discord);
    if (!didAdd) {
        playerFuncs.emit.message(player, `This user may already be whitelisted.`);
        return;
    }

    playerFuncs.emit.message(player, `${discord} added to the whitelist.`);
}

async function handleCommandRemove(player: alt.Player, discord: string): Promise<void> {
    if (!discord) {
        playerFuncs.emit.message(player, ChatController.getDescription('removewhitelist'));
        return;
    }

    if (discord.length <= 17) {
        playerFuncs.emit.message(player, `Discord IDs are at least 18 characters long.`);
        return;
    }

    const didRemove = OptionsController.removeFromWhitelist(discord);
    if (!didRemove) {
        playerFuncs.emit.message(player, `This user did not exist in the whitelist.`);
        return;
    }

    playerFuncs.emit.message(player, `${discord} removed from the whitelist.`);
}
