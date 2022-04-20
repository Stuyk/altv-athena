import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { command, consoleCommand } from '../../../../server/decorators/commands';
import ChatController from '../../../../server/systems/chat';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { OptionsController } from './OptionsController';

class DiscordCommands {
    @command(
        'addwhitelist',
        LocaleController.get(LOCALE_KEYS.COMMAND_ADD_WHITELIST, '/addwhitelist'),
        PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR,
    )
    private static addWhitelistCommand(player: alt.Player, discord: string) {
        if (!discord) {
            Athena.player.emit.message(player, ChatController.getDescription('addwhitelist'));
            return;
        }

        if (discord.length <= 17) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.DISCORD_ID_NOT_LONG_ENOUGH));
            return;
        }

        const didAdd = OptionsController.addToWhitelist(discord);
        if (!didAdd) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.DISCORD_ALREADY_WHITELISTED, discord));
            return;
        }

        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.DISCORD_ADDED_WHITELIST, discord));
    }

    @command(
        'removewhitelist',
        LocaleController.get(LOCALE_KEYS.COMMAND_REMOVE_WHITELIST, '/removewhitelist'),
        PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR,
    )
    private static removeWhitelistCommand(player: alt.Player, discord: string) {
        if (!discord) {
            Athena.player.emit.message(player, ChatController.getDescription('removewhitelist'));
            return;
        }

        if (discord.length <= 17) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.DISCORD_ID_NOT_LONG_ENOUGH));
            return;
        }

        const didRemove = OptionsController.removeFromWhitelist(discord);
        if (!didRemove) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.DISCORD_NOT_WHITELISTED, discord));
            return;
        }

        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.DISCORD_REMOVED_WHITELIST, discord));
    }

    @consoleCommand('/addwhitelist')
    static addWhitelistConsoleCommand(discord: string) {
        if (discord === undefined) {
            alt.logWarning(`/addwhitelist <discord_id>>`);
            return;
        }

        const wasAdded = OptionsController.addToWhitelist(discord);
        if (!wasAdded) {
            alt.logWarning(`Could not add: ${discord} to the whitelist.`);
            return;
        }

        alt.log(`${discord} was added to the list.`);
    }

    @consoleCommand('/removewhitelist')
    static removeWhitelistConsoleCommand(discord: string) {
        if (discord === undefined) {
            alt.logWarning(`/removewhitelist <discord_id>>`);
            return;
        }

        const wasRemoved = OptionsController.removeFromWhitelist(discord);
        if (!wasRemoved) {
            alt.logWarning(`${discord} does not exist in the list or was already removed.`);
            return;
        }

        alt.log(`${discord} was removed from the list.`);
    }
}
