import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';
import { OptionsController } from '../systems/options';

ChatController.addCommand(
    'addwhitelist',
    LocaleController.get(LOCALE_KEYS.COMMAND_ADD_WHITELIST, '/addwhitelist'),
    Permissions.Admin | Permissions.Moderator,
    handleCommandAdd
);

ChatController.addCommand(
    'removewhitelist',
    LocaleController.get(LOCALE_KEYS.COMMAND_REMOVE_WHITELIST, '/removewhitelist'),
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
